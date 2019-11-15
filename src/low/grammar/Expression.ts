import { BooleanLiteral, IntegerLiteral, VarName } from '../parser/ParserGrammarLexemes';
import { UnaryExpression } from './UnaryExpression';
import { BinaryExpression } from './BinaryExpression';


export type Expression = VarName | BooleanLiteral | IntegerLiteral | UnaryExpression | BinaryExpression;

export {
    UnaryExpression,
    BinaryExpression
}