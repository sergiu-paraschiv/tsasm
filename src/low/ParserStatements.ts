export class Const {
    public value: number;

    constructor(value: number) {
        this.value = value;
    }
}

export enum MathOp {
    SUM = 'SUM',
    SUB = 'SUB',
    MUL = 'MUL',
    DIV = 'DIV',
    MOD = 'MOD',
    EXP = 'EXP'
}

export class BinOp {
    public op: MathOp;
    public left: BinOp | Const | string;
    public right: BinOp | Const | string;

    constructor(op: MathOp, left: BinOp | Const | string, right: BinOp | Const | string) {
        this.op = op;
        this.left = left;
        this.right = right;
    }
}

export class Declare {
    public varName: string;
    public initializer?: BinOp | Const | string;

    constructor(varName: string, initializer?: BinOp | Const | string) {
        this.varName = varName;
        this.initializer = initializer;
    }
}

export class Assign {
    public varName: string;
    public value: BinOp | Const | string;

    constructor(varName: string, value: BinOp | Const | string) {
        this.varName = varName;
        this.value = value;
    }
}
