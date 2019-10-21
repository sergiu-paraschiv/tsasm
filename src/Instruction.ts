export enum Opcode {
    HALT     = 0,
    LOAD,
    LOADA,
    LOADAR,
    ADD,
    ADDI,
    INC,
    SUB,
    SUBI,
    DEC,
    MUL,
    MULI,
    DIV,
    DIVI,
    CMP,
    CMPI,
    CMPN,
    CMPNI,
    JMP,
    JMPL,
    JMPF,
    JMPB,
    JEQ,
    JEQL,
    JNEQ,
    JNEQL,
    JGT,
    JGTL,
    JLT,
    JLTL,
    JGTE,
    JGTEL,
    JLTE,
    JLTEL,
    PUTS,
    SAVE,
    SAVETOR,
    SAVER,
    SAVERTOR,
    PUSH,
    PUSHM,
    POP,
    POPM,
    CALL,
    RET,
    MOV,
    AND,
    OR,
    XOR,
    NOT,
    BIC,
    SHL,
    SHLI,
    SHR,
    SHRI,
    HEAD     = 199,
    ILGL
}

export const OpcodeMAP: {
    [key: string]: Opcode
} = {
    'HALT': Opcode.HALT,
    'LOAD': Opcode.LOAD,
    'ADD':  Opcode.ADD,
    'ADDI':  Opcode.ADDI,
    'INC': Opcode.INC,
    'SUB':  Opcode.SUB,
    'SUBI':  Opcode.SUBI,
    'DEC': Opcode.DEC,
    'MUL':  Opcode.MUL,
    'MULI':  Opcode.MULI,
    'DIV':  Opcode.DIV,
    'DIVI':  Opcode.DIVI,
    'JMP':  Opcode.JMP,
    'JMPF': Opcode.JMPF,
    'JMPB': Opcode.JMPB,
    'CMP':  Opcode.CMP,
    'CMPI':  Opcode.CMPI,
    'CMPN':  Opcode.CMPN,
    'CMPNI':  Opcode.CMPNI,
    'JEQ':  Opcode.JEQ,
    'JNEQ': Opcode.JNEQ,
    'JGT':  Opcode.JGT,
    'JLT':  Opcode.JLT,
    'JGTE': Opcode.JGTE,
    'JLTE': Opcode.JLTE,
    'PUTS': Opcode.PUTS,
    'SAVE': Opcode.SAVE,
    'PUSH': Opcode.PUSH,
    'POP' : Opcode.POP,
    'CALL': Opcode.CALL,
    'RET' : Opcode.RET,
    'MOV' : Opcode.MOV,
    'AND' : Opcode.AND,
    'OR' : Opcode.OR,
    'XOR' : Opcode.XOR,
    'NOT' : Opcode.NOT,
    'BIC' : Opcode.BIC,
    'SHL' : Opcode.SHL,
    'SHR' : Opcode.SHR
};

export enum Directive {
    ASCIIZ = '.asciiz'
}

export const ID_HEADER = Uint8Array.from([Opcode.HEAD, 65, 83, 77]);