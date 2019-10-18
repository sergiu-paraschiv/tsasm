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
    PUTS  = 30,
    SAVE  = 34,


    // opcodes not exposed by assembler

    HEAD  = 199,

    LOADA = 32,
    LOADAR = 33,

    // jumps to labels
    JMPL  = 20,
    JEQL  = 21,
    JNEQL = 22,
    JGTL  = 23,
    JLTL  = 24,
    JGTEL = 25,
    JLTEL = 26,

    SAVETOR = 35,
    SAVER = 36,
    SAVERTOR = 37,

    ILGL
}

export enum Directive {
    ASCIIZ = '.asciiz'
}

export const ID_HEADER = Uint8Array.from([Opcode.HEAD, 65, 83, 77]);