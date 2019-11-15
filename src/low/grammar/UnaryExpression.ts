import {
    BooleanLiteral,
    IntegerLiteral,
    ItemWithValue,
    UnaryBooleanOperator,
    UnaryIntegerOperator,
    VarName
} from '../parser/ParserGrammarLexemes';
import { IGrammarBitVisitor } from './IGrammarBitVisitor';
import { IGrammarBit } from './IGrammarBit';
import { BinaryExpression } from './BinaryExpression';
import { Expression } from './Expression';
import { CompilerState } from '../CompilerState';
import { CompilerASMGenerationStep } from '../CompilerASMGenerationStep';


export class UnaryExpression
    extends ItemWithValue<[
        UnaryBooleanOperator | UnaryIntegerOperator,
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
            if (this.value[1] instanceof IntegerLiteral) {
                visitor.pushLine('LOAD $1 ' + this.value[1].value);
            }
            else if (this.value[1] instanceof BooleanLiteral) {
                visitor.pushLine('LOAD $1 ' + (this.value[1].value ? 1 : 0));
            }
            else if (this.value[1] instanceof VarName) {
                const symbol = state.getStackSymbol(this.value[1]);

                visitor.pushLine(`LOAD $1 [$12, ${symbol.stackIndex - 3}]`);
                visitor.pushLine(`SHL $1 $1 8`);
                visitor.pushLine(`LOAD $1 [$12, ${symbol.stackIndex - 2}]`);
                visitor.pushLine(`SHL $1 $1 8`);
                visitor.pushLine(`LOAD $1 [$12, ${symbol.stackIndex - 1}]`);
                visitor.pushLine(`SHL $1 $1 8`);
                visitor.pushLine(`LOAD $1 [$12, ${symbol.stackIndex}]`);
            }

            if (this.value[0] === UnaryIntegerOperator.NEG) {
                visitor.pushLine('LOAD $2 0');
                visitor.pushLine('SUB $1 $2 $1');
            }
            else if (this.value[0] === UnaryBooleanOperator.NOT) {
                visitor.pushLine('NOT $1');
            }
        }
    }
}
