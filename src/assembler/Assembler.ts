import { Parser } from './Parser';
import { ID_HEADER, Opcode, Directive } from '../Instruction';
import { AssemblerError } from './AssemblerError';


interface ILabels {
    [key: string]: number
}

export interface IDebugData {
    lineMap: (number | null)[]
    usedRegisters: number[]
    labels: ILabels
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

    private DIRECTIVES: string[] = [
        '.asciiz'
    ];

    constructor() {
        this.parser = new Parser();
    }

    public run(src: string, withDebugData = false): {
        program: Uint8Array
        debugData?: IDebugData
    } {
        const linesWithLabels = this.parse(src);
        const [ labels, lines ] = this.extractLabels(linesWithLabels);
        let debugData: IDebugData | undefined = undefined;

        if (withDebugData) {
            debugData = {
                lineMap: [],
                usedRegisters: [],
                labels: {}
            };
        }

        let [ header, codeOffset, bodyLength ] = this.buildHeaderSection(lines);

        const body = new Uint8Array(bodyLength * Assembler.OP_LENGTH);
        const program = Uint8Array.from([
            ... header,
            ... body
        ]);

        for (let i = 0; i < lines.length; i++) {
            if (lines[i] === null) {
                if (debugData) {
                    debugData.lineMap[i] = null;
                }

                continue;
            }

            if (debugData) {
                debugData.lineMap[i] = codeOffset;
            }

            if (this.DATA_MAP.hasOwnProperty(lines[i][0])) {
                const map = this.DATA_MAP[lines[i][0] as string];
                program[codeOffset] = map.opcode;

                for (let dataIndex = 1; dataIndex < Assembler.OP_LENGTH; dataIndex++) {
                    if (
                        map.data[dataIndex - 1] === 8
                        || map.data[dataIndex - 1] === 'reg'
                        || (map.data[dataIndex - 1] === 'reg-or-label' && typeof lines[i][dataIndex] === 'number')
                    ) {
                        program[codeOffset + dataIndex] = lines[i][dataIndex];
                    }

                    else if (map.data[dataIndex - 1] === 16) {
                        program[codeOffset + dataIndex] = lines[i][dataIndex] >>> 8;
                        program[codeOffset + dataIndex + 1] = lines[i][dataIndex] & 255;

                        dataIndex += 1;
                    }

                    else if (
                        map.data[dataIndex - 1] === 'reg-or-label'
                        && typeof lines[i][dataIndex] === 'string'
                    ) {
                        if (!map.opcodeWithLabel) {
                            throw new AssemblerError('Instruction opcode[' + map.opcode + '] accepts reg or label, got label, but no `opcodeWithLabel` is defined');
                        }

                        program[codeOffset] = map.opcodeWithLabel;
                        program[codeOffset + dataIndex] = labels[lines[i][dataIndex]] + header.length;
                    }

                    else {
                        program[codeOffset + dataIndex] = 0;
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

                codeOffset += Assembler.OP_LENGTH;
            }
            else if (this.DIRECTIVES.indexOf(lines[i][0]) > -1) {
                // do nothing
            }
            else {
                // this will never happen, the parser should guarantee it.
                throw new AssemblerError(`Unknown opcode [${lines[i][0]}] encountered!`);
            }
        }

        if (debugData) {
            debugData.usedRegisters = debugData.usedRegisters.sort((a: number, b: number) => a - b);
            debugData.labels = {};

            const labelNames = Object.keys(labels).sort();
            for (let i = 0; i < labelNames.length; i++) {
                debugData.labels[labelNames[i]] = labels[labelNames[i]] + header.length;
            }
        }

        return {
            program,
            debugData
        };
    }

    private buildHeaderSection(lines: any[]): [
        Uint8Array,
        number,
        number
    ] {
        const codeLines = lines.filter(line => line !== null);
        const header: number[] = [];
        let consumedLines = 0;

        for (let i = 0; i < Assembler.OP_LENGTH; i++) {
            header.push(ID_HEADER[i]);
        }

        const constants: number[] = [];

        for (let i = 0; i < codeLines.length; i++) {
            if (lines[i] === null) {
                continue;
            }

            if (lines[i][0] === Directive.ASCIIZ) {
                for (let j = 0; j < lines[i][1].length; j++) {
                    constants.push(lines[i][1][j].charCodeAt(0));
                }

                constants.push(0);

                consumedLines += 1;
            }
        }

        let padding = 0;
        while (((constants.length + padding) % Assembler.OP_LENGTH) !== 0) {
            padding += 1;
        }

        for (let i = 0; i < padding; i++) {
            constants.push(0);
        }

        header.push(2 * Assembler.OP_LENGTH + constants.length);
        header.push(0);
        header.push(0);
        header.push(0);

        header.push(... constants);

        const program = Uint8Array.from(header);

        return [ program, header.length, codeLines.length - consumedLines ];
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
                labels[linesWithLabels[i].label] = pc * Assembler.OP_LENGTH;
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