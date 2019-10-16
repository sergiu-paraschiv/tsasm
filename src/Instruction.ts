export enum Opcode {
    HALT = 0,
    LOAD = 1,
    ADD  = 2,
    SUB  = 3,
    MUL  = 4,
    DIV  = 5,
    JMP  = 6,
    JMPF = 7,
    JMPB = 8,
    CMP  = 9,
    JGT  = 11,
    JLT  = 12,
    JGTE = 13,
    JLTE = 14,
    JEQ  = 15,
    JNEQ = 16,

    // jumps to labels
    JMPL  = 20,
    JEQL  = 21,
    JNEQL = 22,
    JGTL  = 23,
    JLTL  = 24,
    JGTEL = 25,
    JLTEL = 26,

    ILGL
}

export class Instruction {
    public opcode: Opcode;

    constructor(opcode: Opcode) {
        this.opcode = opcode;
    }
}