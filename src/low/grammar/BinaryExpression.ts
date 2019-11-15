import {
    BinaryBooleanOperator,
    BinaryIntegerOperator,
    BooleanLiteral,
    IntegerLiteral,
    ItemWithValue,
    VarName
} from '../parser/ParserGrammarLexemes';
import { Expression } from './Expression';
import { IGrammarBitVisitor } from './IGrammarBitVisitor';
import { IGrammarBit } from './IGrammarBit';
import { UnaryExpression } from './UnaryExpression';
import { CompilerState } from '../CompilerState';
import { CompilerASMGenerationStep } from '../CompilerASMGenerationStep';


export class BinaryExpression
    extends ItemWithValue<[
        BinaryBooleanOperator | BinaryIntegerOperator,
        Expression,
        Expression
    ]>
    implements IGrammarBit
{
    public accept(visitor: IGrammarBitVisitor, state: CompilerState): void {
        if (
            this.value[1] instanceof UnaryExpression
            || this.value[1] instanceof BinaryExpression
        ) {
            visitor.visit(this.value[1], state);
        }

        if (visitor instanceof CompilerASMGenerationStep) {
            if (
                this.value[1] instanceof IntegerLiteral
            ) {
                visitor.pushLine('LOAD $1 ' + this.value[1].value);
            }
            else if (
                this.value[1] instanceof BooleanLiteral
            ) {
                visitor.pushLine('LOAD $1 ' + (this.value[1].value ? 1 : 0));
            }
            else if (
                this.value[1] instanceof VarName
            ) {
                const symbol = state.getStackSymbol(this.value[1]);

                visitor.pushLine(`LOAD $1 [$12, ${symbol.stackIndex - 3}]`);
                visitor.pushLine(`SHL $1 $1 8`);
                visitor.pushLine(`LOAD $1 [$12, ${symbol.stackIndex - 2}]`);
                visitor.pushLine(`SHL $1 $1 8`);
                visitor.pushLine(`LOAD $1 [$12, ${symbol.stackIndex - 1}]`);
                visitor.pushLine(`SHL $1 $1 8`);
                visitor.pushLine(`LOAD $1 [$12, ${symbol.stackIndex}]`);
            }

            visitor.pushLine('PUSH $1');
        }

        if (
            this.value[2] instanceof UnaryExpression
            || this.value[2] instanceof BinaryExpression
        ) {
            visitor.visit(this.value[2], state);
        }

        if (visitor instanceof CompilerASMGenerationStep) {
            if (
                this.value[2] instanceof IntegerLiteral
            ) {
                visitor.pushLine('LOAD $1 ' + this.value[2].value);
            }
            else if (
                this.value[2] instanceof BooleanLiteral
            ) {
                visitor.pushLine('LOAD $1 ' + (this.value[2].value ? 1 : 0));
            }
            else if (
                this.value[2] instanceof VarName
            ) {
                const symbol = state.getStackSymbol(this.value[2]);

                visitor.pushLine(`LOAD $1 [$12, ${symbol.stackIndex - 3}]`);
                visitor.pushLine(`SHL $1 $1 8`);
                visitor.pushLine(`LOAD $1 [$12, ${symbol.stackIndex - 2}]`);
                visitor.pushLine(`SHL $1 $1 8`);
                visitor.pushLine(`LOAD $1 [$12, ${symbol.stackIndex - 1}]`);
                visitor.pushLine(`SHL $1 $1 8`);
                visitor.pushLine(`LOAD $1 [$12, ${symbol.stackIndex}]`);
            }

            visitor.pushLine('POP $2');
        }

        if (visitor instanceof CompilerASMGenerationStep) {
            if (this.value[0] === BinaryIntegerOperator.ADD) {
                visitor.pushLine('ADD $1 $1 $2');
            }
            else if (this.value[0] === BinaryIntegerOperator.SUB) {
                visitor.pushLine('SUB $1 $2 $1');
            }
            else if (this.value[0] === BinaryIntegerOperator.MUL) {
                visitor.pushLine('MUL $1 $1 $2');
            }
            else if (this.value[0] === BinaryIntegerOperator.DIV) {
                visitor.pushLine('DIV $1 $2 $1');
            }
            else if (this.value[0] === BinaryIntegerOperator.MOD) {
                // TODO
            }
            else if (this.value[0] === BinaryBooleanOperator.AND) {
                visitor.pushLine('AND $1 $1 $2');
            }
            else if (this.value[0] === BinaryBooleanOperator.OR) {
                visitor.pushLine('OR $1 $1 $2');
            }
            else if (this.value[0] === BinaryBooleanOperator.EQ) {
                // TODO
            }
            else if (this.value[0] === BinaryBooleanOperator.NEQ) {
                // TODO
            }
        }
    }
}
