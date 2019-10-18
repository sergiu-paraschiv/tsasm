export enum Opcode {
    HALT     = 0,
    LOAD     = 1,
    LOADA    = 2,
    LOADAR   = 3,
    ADD      = 4,
    SUB      = 5,
    MUL      = 6,
    DIV      = 7,
    CMP      = 8,
    JMP      = 9,
    JMPL     = 10,
    JMPF     = 11,
    JMPB     = 12,
    JEQ      = 13,
    JEQL     = 14,
    JNEQ     = 15,
    JNEQL    = 16,
    JGT      = 17,
    JGTL     = 18,
    JLT      = 19,
    JLTL     = 20,
    JGTE     = 21,
    JGTEL    = 22,
    JLTE     = 23,
    JLTEL    = 24,
    PUTS     = 25,
    SAVE     = 26,
    SAVETOR  = 27,
    SAVER    = 28,
    SAVERTOR = 29,
    HEAD     = 199,
    ILGL
}

export enum Directive {
    ASCIIZ = '.asciiz'
}

export const ID_HEADER = Uint8Array.from([Opcode.HEAD, 65, 83, 77]);