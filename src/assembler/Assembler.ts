import { Parser } from './Parser';
import { Directive, ID_HEADER, Opcode, OpcodeMAP } from '../Instruction';
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
    private stackSize: number = 256 * 256 - 3;

    private DIRECTIVES: string[] = Object.values(Directive);

    constructor() {
        this.parser = new Parser();
    }

    public run(src: string, withDebugData = false): {
        program: Uint8Array
        debugData?: IDebugData
    } {
        const lines = this.parse(src);
        let debugData: IDebugData | undefined = undefined;

        if (withDebugData) {
            debugData = {
                lineMap: [],
                usedRegisters: [],
                labels: {}
            };
        }

        let [ header, labels, codeOffset, bodyLength ] = this.buildHeaderSection(lines);

        const body = new Uint8Array(bodyLength * Assembler.OP_LENGTH);
        const program = Uint8Array.from([
            ... header,
            ... body
        ]);

        let labelsPhaseCodeOffset = codeOffset;
        for (let i = 0; i < lines.length; i++) {
            if (lines[i] === null) {
                if (debugData) {
                    debugData.lineMap[i] = null;
                }

                continue;
            }

            let op = lines[i];
            let label;
            if (
                op instanceof Object
                && op.op
                && op.label
            ) {
                label = op.label;
                op = op.op;
            }

            if (OpcodeMAP.hasOwnProperty(op[0])) {
                if (label) {
                    labels[label] = labelsPhaseCodeOffset;
                }

                labelsPhaseCodeOffset += Assembler.OP_LENGTH;
            }
        }

        for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
            if (lines[lineIndex] === null) {
                if (debugData) {
                    debugData.lineMap[lineIndex] = null;
                }

                continue;
            }

            let op = lines[lineIndex];
            if (
                op instanceof Object
                && op.op
                && op.label
            ) {
                op = op.op;
            }


            if (debugData) {
                for (let i = 1; i < op.length; i++) {
                    if (op[i].reg) {
                        debugData.usedRegisters = this.saveDebugUsedRegisters(debugData.usedRegisters, op[i].reg);
                    }
                }
            }

            if (OpcodeMAP.hasOwnProperty(op[0])) {
                const opcode = OpcodeMAP[op[0]];
                program[codeOffset] = opcode;

                switch (opcode) {
                    case Opcode.HALT:
                        program[codeOffset + 1] = 0;
                        program[codeOffset + 2] = 0;
                        program[codeOffset + 3] = 0;
                        break;

                    case Opcode.ADD:
                    case Opcode.SUB:
                    case Opcode.DIV:
                    case Opcode.MUL:
                        program[codeOffset + 1] = op[1].reg;
                        if (op[2].reg) {
                            program[codeOffset + 2] = op[2].reg;
                        }
                        else {
                            program[codeOffset + 2] = op[2];

                            switch (program[codeOffset]) {
                                case Opcode.ADD:
                                    program[codeOffset] = Opcode.ADDI;
                                    break;
                                case Opcode.SUB:
                                    program[codeOffset] = Opcode.SUBI;
                                    break;
                                case Opcode.DIV:
                                    program[codeOffset] = Opcode.DIVI;
                                    break;
                                case Opcode.MUL:
                                    program[codeOffset] = Opcode.MULI;
                                    break;
                                default:
                                    // should never get here
                                    throw new AssemblerError('Unexpected Opcode!');
                            }
                        }
                        program[codeOffset + 3] = op[3].reg;
                        break;

                    case Opcode.INC:
                    case Opcode.DEC:
                    case Opcode.NOT:
                        program[codeOffset + 1] = op[1].reg;
                        program[codeOffset + 2] = 0;
                        program[codeOffset + 3] = 0;
                        break;

                    case Opcode.JMP:
                    case Opcode.JMPF:
                    case Opcode.JMPB:
                    case Opcode.JEQ:
                    case Opcode.JNEQ:
                    case Opcode.JGT:
                    case Opcode.JLT:
                    case Opcode.JGTE:
                    case Opcode.JLTE:
                        if (op[1].reg) {
                            program[codeOffset + 1] = op[1].reg;
                        }
                        else if (op[1].label) {
                            program[codeOffset + 1] = labels[op[1].label];

                            switch (program[codeOffset]) {
                                case Opcode.JMP:
                                    program[codeOffset] = Opcode.JMPL;
                                    break;
                                case Opcode.JEQ:
                                    program[codeOffset] = Opcode.JEQL;
                                    break;
                                case Opcode.JNEQ:
                                    program[codeOffset] = Opcode.JNEQL;
                                    break;
                                case Opcode.JGT:
                                    program[codeOffset] = Opcode.JGTL;
                                    break;
                                case Opcode.JLT:
                                    program[codeOffset] = Opcode.JLTL;
                                    break;
                                case Opcode.JGTE:
                                    program[codeOffset] = Opcode.JGTEL;
                                    break;
                                case Opcode.JLTE:
                                    program[codeOffset] = Opcode.JLTEL;
                                    break;
                                default:
                                    // should never get here
                                    throw new AssemblerError('JMPF and JMPB don\'t support label param!');
                            }
                        }
                        else {
                            // should never get here
                            throw new AssemblerError(`Unexpected JMP (${program[codeOffset]}) param. Should be reg or label!`);
                        }

                        program[codeOffset + 2] = 0;
                        program[codeOffset + 3] = 0;
                        break;

                    case Opcode.CMP:
                    case Opcode.CMPN:
                    case Opcode.CMPI:
                    case Opcode.CMPNI:
                        program[codeOffset + 1] = op[1].reg;

                        if (op[2].reg) {
                            program[codeOffset + 2] = op[2].reg;
                            program[codeOffset + 3] = 0;
                        }
                        else {
                            if (opcode === Opcode.CMP) {
                                program[codeOffset] = Opcode.CMPI;
                            }
                            else if (opcode === Opcode.CMPN) {
                                program[codeOffset] = Opcode.CMPNI;
                            }
                            program[codeOffset + 2] = op[2] >>> 8;
                            program[codeOffset + 3] = op[2] & 255;
                        }

                        break;

                    case Opcode.LOAD:
                        program[codeOffset + 1] = op[1].reg;

                        if (op[2].addr && op[2].addr.reg) {
                            program[codeOffset] = Opcode.LOADAR;
                            program[codeOffset + 2] = op[2].addr.reg;
                            program[codeOffset + 3] = op[2].offset;
                        }
                        else if (op[2].addr) {
                            program[codeOffset] = Opcode.LOADA;
                            program[codeOffset + 2] = (op[2].addr + op[2].offset) >>> 8;
                            program[codeOffset + 3] = (op[2].addr + op[2].offset) & 255;
                        }
                        else {
                            program[codeOffset + 2] = op[2] >>> 8;
                            program[codeOffset + 3] = op[2] & 255;
                        }

                        break;

                    case Opcode.PUTS:
                        program[codeOffset + 1] = labels[op[1].label];
                        program[codeOffset + 2] = 0;
                        program[codeOffset + 3] = 0;

                        break;

                    case Opcode.SAVE:
                        if (op[1].addr.reg && op[2].reg) {
                            program[codeOffset] = Opcode.SAVERTOR;
                            program[codeOffset + 1] = op[1].addr.reg;
                            program[codeOffset + 2] = op[1].offset;
                            program[codeOffset + 3] = op[2].reg;
                        }
                        else if (op[2].reg) {
                            program[codeOffset] = Opcode.SAVER;
                            program[codeOffset + 1] = (op[1].addr + op[1].offset) >>> 8;
                            program[codeOffset + 2] = (op[1].addr + op[1].offset) & 255;
                            program[codeOffset + 3] = op[2].reg;
                        }
                        else if (op[1].addr.reg) {
                            program[codeOffset] = Opcode.SAVETOR;
                            program[codeOffset + 1] = op[1].addr.reg;
                            program[codeOffset + 2] = op[1].offset;
                            program[codeOffset + 3] = op[2] & 255;
                        }
                        else {
                            program[codeOffset + 1] = (op[1].addr + op[1].offset) >>> 8;
                            program[codeOffset + 2] = (op[1].addr + op[1].offset) & 255;
                            program[codeOffset + 3] = op[2];
                        }

                        break;

                    case Opcode.PUSH:
                    case Opcode.POP:
                        if (op[1].reglist) {
                            if (opcode === Opcode.PUSH) {
                                program[codeOffset] = Opcode.PUSHM;
                            }
                            else {
                                program[codeOffset] = Opcode.POPM;
                            }

                            const reglist = this.buildReglist(op[1].reglist);

                            program[codeOffset + 1] = (reglist >>> 16) & 255;
                            program[codeOffset + 2] = (reglist >>> 8) & 255;
                            program[codeOffset + 3] = reglist & 255;
                        }
                        else {
                            program[codeOffset + 1] = op[1].reg;
                            program[codeOffset + 2] = 0;
                            program[codeOffset + 3] = 0;
                        }

                        break;

                    case Opcode.CALL:
                        program[codeOffset + 1] = labels[op[1].label];
                        program[codeOffset + 2] = 0;
                        program[codeOffset + 3] = 0;

                        break;

                    case Opcode.RET:
                        program[codeOffset + 1] = 0;
                        program[codeOffset + 2] = 0;
                        program[codeOffset + 3] = 0;

                        break;

                    case Opcode.MOV:
                        program[codeOffset + 1] = op[1].reg;
                        program[codeOffset + 2] = op[2].reg;
                        program[codeOffset + 3] = 0;
                        break;

                    case Opcode.AND:
                    case Opcode.OR:
                    case Opcode.XOR:
                    case Opcode.BIC:
                    case Opcode.ANDI:
                    case Opcode.ORI:
                    case Opcode.XORI:
                    case Opcode.BICI:
                        program[codeOffset + 1] = op[1].reg;

                        if (op[2].reg) {
                            program[codeOffset + 2] = op[2].reg;
                            program[codeOffset + 3] = 0;
                        }
                        else {
                            if (opcode === Opcode.AND) {
                                program[codeOffset] = Opcode.ANDI;
                            }
                            else if (opcode === Opcode.OR) {
                                program[codeOffset] = Opcode.ORI;
                            }
                            else if (opcode === Opcode.XOR) {
                                program[codeOffset] = Opcode.XORI;
                            }
                            else if (opcode === Opcode.BIC) {
                                program[codeOffset] = Opcode.BICI;
                            }

                            program[codeOffset + 2] = op[2] >>> 8;
                            program[codeOffset + 3] = op[2] & 255;
                        }
                        break;


                    case Opcode.SHL:
                    case Opcode.SHR:
                        program[codeOffset + 1] = op[1].reg;
                        program[codeOffset + 2] = op[2].reg;

                        if (op[3].reg) {
                            program[codeOffset + 3] = op[3].reg;
                        }
                        else {
                            if (opcode === Opcode.SHL) {
                                program[codeOffset] = Opcode.SHLI;
                            }
                            else {
                                program[codeOffset] = Opcode.SHRI;
                            }

                            program[codeOffset + 3] = op[3];
                        }
                        break;

                    default:
                        // this should never happen
                }

                if (debugData) {
                    debugData.lineMap[lineIndex] = codeOffset;
                }

                codeOffset += Assembler.OP_LENGTH;
            }
            else if (this.DIRECTIVES.indexOf(op[0]) > -1) {
                // do nothing
            }
            else {
                // this will never happen, the parser should guarantee it.
                throw new AssemblerError(`Unknown opcode [${op[0]}] encountered!`);
            }
        }

        if (debugData) {
            debugData.usedRegisters = debugData.usedRegisters.sort((a: number, b: number) => a - b);
            debugData.labels = {};

            const labelNames = Object.keys(labels).sort();
            for (let i = 0; i < labelNames.length; i++) {
                debugData.labels[labelNames[i]] = labels[labelNames[i]];
            }
        }

        return {
            program,
            debugData
        };
    }

    private buildReglist(list: number[]) {
        let res = list[0];

        let i = 1;
        while (i < list.length) {
            res = (res << 4) | list[i];
            i += 1;
        }

        res = (res << 4) | list.length;

        return res;
    }

    private buildHeaderSection(lines: any[]): [
        Uint8Array,
        ILabels,
        number,
        number
    ] {
        const codeLines = lines.filter(line => line !== null);
        const header: number[] = [];
        const labels: ILabels = {};
        let consumedLines = 0;

        for (let i = 0; i < Assembler.OP_LENGTH; i++) {
            header.push(ID_HEADER[i]);
        }

        const constants: number[] = [];

        for (let i = 0; i < codeLines.length; i++) {
            let label;
            let op = codeLines[i];

            if (op === null) {
                continue;
            }

            if (
                op instanceof Object
                && op.op
                && op.label
            ) {
                label = op.label;
                op = op.op;
            }

            if (op[0] === Directive.ASCIIZ) {
                if (label) {
                    labels[label] = (
                        2 * Assembler.OP_LENGTH
                    ) + constants.length + 56; // 56 = header padding
                }

                for (let j = 0; j < op[1].length; j++) {
                    constants.push(op[1][j].charCodeAt(0));
                }

                constants.push(0);

                consumedLines += 1;
            }
            else if (op[0] === Directive.STACK) {
                this.stackSize = op[1];

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

        header.push(this.stackSize >>> 8);
        header.push(this.stackSize & 255);
        header.push(0);
        header.push(0);

        for (let i = 0; i < 52; i++) { // 64 - ID_HEADER - stack size - constants offset
            header.push(0);
        }

        header.push(64 + constants.length); // 64 = header size, with reserved 60 bytes
        header.push(0);
        header.push(0);
        header.push(0);

        header.push(... constants);

        return [
            Uint8Array.from(header),
            labels,
            header.length,
            codeLines.length - consumedLines
        ];
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

    private saveDebugUsedRegisters(usedRegisters: number[], ... regs: number[]): number[] {
        for (let i = 0; i < regs.length; i++) {
            if (usedRegisters.indexOf(regs[i]) < 0) {
                usedRegisters.push(regs[i]);
            }
        }

        return usedRegisters;
    }
}