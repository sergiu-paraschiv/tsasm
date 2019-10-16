import { Parser } from './Parser';
import { Opcode } from '../Instruction';
import { AssemblerError } from './AssemblerError';


interface ILabels {
    [key: string]: number
}

export interface IDebugData {
    lineMap: (number | null)[]
    usedRegisters: number[]
}

export class Assembler {
    private parser: Parser;
    private static OP_LENGTH = 4;

    private DATA_MAP: {
        [key: string]: {
            opcode: Opcode
            data: (0 | 8 | 16 | 'reg' | 'reg-or-label')[]
            opcodeWithLabel?: Opcode
        }
    } = {
        'HALT': {
            opcode: Opcode.HALT,
            data: [ ]
        },

        'LOAD': {
            opcode: Opcode.LOAD,
            data: [ 'reg', 16 ]
        },

        'ADD': {
            opcode: Opcode.ADD,
            data: [ 'reg', 'reg', 'reg' ]
        },

        'SUB': {
            opcode: Opcode.SUB,
            data: [ 'reg', 'reg', 'reg' ]
        },

        'MUL': {
            opcode: Opcode.MUL,
            data: [ 'reg', 'reg', 'reg' ]
        },

        'DIV': {
            opcode: Opcode.DIV,
            data: [ 'reg', 'reg', 'reg' ]
        },

        'JMP': {
            opcode: Opcode.JMP,
            data: [ 'reg-or-label' ],
            opcodeWithLabel: Opcode.JMPL
        },

        'JMPF': {
            opcode: Opcode.JMPF,
            data: [ 'reg' ]
        },

        'JMPB': {
            opcode: Opcode.JMPB,
            data: [ 'reg' ]
        },

        'CMP': {
            opcode: Opcode.CMP,
            data: [ 'reg', 'reg' ]
        },

        'JEQ': {
            opcode: Opcode.JEQ,
            data: [ 'reg-or-label' ],
            opcodeWithLabel: Opcode.JEQL
        },

        'JNEQ': {
            opcode: Opcode.JNEQ,
            data: [ 'reg-or-label' ],
            opcodeWithLabel: Opcode.JNEQL
        },

        'JGT': {
            opcode: Opcode.JGT,
            data: [ 'reg-or-label' ],
            opcodeWithLabel: Opcode.JGTL
        },

        'JLT': {
            opcode: Opcode.JLT,
            data: [ 'reg-or-label' ],
            opcodeWithLabel: Opcode.JLTL
        },

        'JGTE': {
            opcode: Opcode.JGTE,
            data: [ 'reg-or-label' ],
            opcodeWithLabel: Opcode.JGTEL
        },

        'JLTE': {
            opcode: Opcode.JLTE,
            data: [ 'reg-or-label' ],
            opcodeWithLabel: Opcode.JLTEL
        }
    };

    constructor() {
        this.parser = new Parser();
    }

    public run(src: string, withDebugData = false): {
        program: Uint8Array
        debugData?: IDebugData
    } {
        const linesWithLabels = this.parse(src);
        const [ labels, lines ] = this.extractLabels(linesWithLabels);
        const codeLines = lines.filter(line => line !== null);
        const program = new Uint8Array(codeLines.length * Assembler.OP_LENGTH);
        let debugData: IDebugData | undefined = undefined;

        if (withDebugData) {
            debugData = {
                lineMap: [],
                usedRegisters: []
            };
        }

        let pc = 0;
        for (let i = 0; i < lines.length; i++) {
            if (lines[i] === null) {
                if (debugData) {
                    debugData.lineMap[i] = null;
                }

                continue;
            }

            if (debugData) {
                debugData.lineMap[i] = pc * Assembler.OP_LENGTH;
            }

            if (this.DATA_MAP.hasOwnProperty(lines[i][0])) {
                const map = this.DATA_MAP[lines[i][0] as string];
                program[(pc * Assembler.OP_LENGTH)] = map.opcode;

                for (let dataIndex = 1; dataIndex < Assembler.OP_LENGTH; dataIndex++) {
                    if (
                        map.data[dataIndex - 1] === 8
                        || map.data[dataIndex - 1] === 'reg'
                        || (map.data[dataIndex - 1] === 'reg-or-label' && typeof lines[i][dataIndex] === 'number')
                    ) {
                        program[(
                            pc * Assembler.OP_LENGTH
                        ) + dataIndex] = lines[i][dataIndex];
                    }

                    else if (map.data[dataIndex - 1] === 16) {
                        program[(
                            pc * Assembler.OP_LENGTH
                        ) + dataIndex] = lines[i][dataIndex] >>> 8;

                        program[(
                            pc * Assembler.OP_LENGTH
                        ) + dataIndex + 1] = lines[i][dataIndex] & 255;

                        dataIndex += 1;
                    }

                    else if (
                        map.data[dataIndex - 1] === 'reg-or-label'
                        && typeof lines[i][dataIndex] === 'string'
                    ) {
                        if (!map.opcodeWithLabel) {
                            throw new AssemblerError('Instruction opcode[' + map.opcode + '] accepts reg or label, got label, but no `opcodeWithLabel` is defined');
                        }

                        program[(pc * Assembler.OP_LENGTH)] = map.opcodeWithLabel;

                        program[(
                            pc * Assembler.OP_LENGTH
                        ) + dataIndex] = labels[lines[i][dataIndex]] * Assembler.OP_LENGTH;
                    }

                    else {
                        program[(
                            pc * Assembler.OP_LENGTH
                        ) + dataIndex] = 0;
                    }

                    if (
                        debugData
                        && (
                            map.data[dataIndex - 1] === 'reg'
                            || (map.data[dataIndex - 1] === 'reg-or-label' && typeof lines[i][dataIndex] === 'number')
                        )
                        && debugData.usedRegisters.indexOf(lines[i][dataIndex]) < 0
                    ) {
                        debugData.usedRegisters.push(lines[i][dataIndex]);
                    }
                }

                pc += 1;
            }
            else {
                // this will never happen, the parser should guarantee it.
                throw new AssemblerError('Unknown Opcode encountered!');
            }
        }

        if (debugData) {
            debugData.usedRegisters = debugData.usedRegisters.sort((a: number, b: number) => a - b);
        }

        return {
            program,
            debugData
        };
    }

    private parse(src: string): any[] {
        this.parser.feed(src + '\n');

        if (this.parser.results.length > 1) {
            throw new AssemblerError('Parser returned more than one result. Ambiguous parser!')
        }

        if (this.parser.results.length < 1) {
            throw new AssemblerError('Parser did not return a result. Parsing error!')
        }

        return this.parser.results[0];
    }

    private extractLabels(linesWithLabels: any[]): [ ILabels, any[] ] {
        const labels: ILabels = {};
        const lines: any[] = [];

        let pc = 0;
        for (let i = 0; i < linesWithLabels.length; i++) {
            if (linesWithLabels[i] instanceof Array) {
                lines.push(linesWithLabels[i]);
                pc += 1;
            }
            else if(linesWithLabels[i]) {
                labels[linesWithLabels[i].label] = pc;
                lines.push(linesWithLabels[i].op);
                pc += 1;
            }
            else {
                lines.push(linesWithLabels[i]);
            }
        }

        return [ labels, lines ];
    }
}