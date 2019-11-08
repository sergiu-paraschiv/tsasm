export interface LexerItem<T> {
    col: number
    line: number
    lineBreaks: number
    offset: number
    text: string
    type: string
    value: T
}

export class Item {
    private readonly _line: number | undefined;

    constructor(value?: Item | LexerItem<any> | any) {
        if (value && (
            (value as any).hasOwnProperty('value')
            || (value instanceof Item)
        )) {
            this._line = value.line;
        }
        else {
            this._line = undefined;
        }
    }

    get line(): number | undefined {
        return this._line;
    }
}

export class ItemWithValue<T> extends Item {
    private readonly _value: T;

    constructor(value: LexerItem<T> | T | LexerItem<T>[] | T[]) {
        if (value && value instanceof Array) {
            super(value[0]);
            this._value = (value as any).map(ItemWithValue.unwrapLexerItemValue);
        }
        else {
            super(value);
            this._value = ItemWithValue.unwrapLexerItemValue(value);
        }
    }

    get value(): T {
        return this._value;
    }

    private static unwrapLexerItemValue = (value: any): any => {
        if (value && (value as any).hasOwnProperty('value')) {
            return value.value;
        }
        else {
            return value;
        }
    }
}

export enum UnaryBooleanOperator {
    NOT = "!",
}

export enum BinaryBooleanOperator {
    EQ  = "=",
    NEQ = "!=",
    OR  = "||",
    AND = "&&"
}

export enum UnaryIntegerOperator {
    POS = "+",
    NEG = "-"
}

export enum BinaryIntegerOperator {
    ADD = "+",
    SUB = "-",
    MUL = "*",
    DIV = "/",
    MOD = "%"
}

export enum BasicType {
    BOOL  = "bool",
    INT   = "int",
    UINT  = "uint",
    FLOAT = "float",
    CHAR  = "char",
    VOID  = "void"
}

export class Block extends ItemWithValue<StatementList> {}

type Statement = Comment | VarDeclaration | VarAssignment | Block | EndOfLine;
type StatementList = Statement[];
type Expression = VarName | BooleanLiteral | IntegerLiteral | UnaryExpression | BinaryExpression;

export class IfStatement extends ItemWithValue<[
    Expression,
    Block
] | [
    Expression,
    Block,
    Block
]> {}

export class VarAssignment extends ItemWithValue<[
    VarName | VarDeclaration,
    VarName | Expression
]> {}

export class VarDeclaration extends ItemWithValue<[
    BasicType,
    VarName
]> {}

export class BinaryExpression extends ItemWithValue<[
    BinaryBooleanOperator | BinaryIntegerOperator,
    Expression,
    Expression
]> {}

export class UnaryExpression extends ItemWithValue<[
    UnaryBooleanOperator | UnaryIntegerOperator,
    VarName | BooleanLiteral | IntegerLiteral | UnaryExpression
]> {}

export class BooleanLiteral extends ItemWithValue<boolean> {}

export class IntegerLiteral extends ItemWithValue<number> {}

export class VarName extends ItemWithValue<string> {}

export class Comment extends ItemWithValue<string> {}
export class EndOfLine extends Item {}