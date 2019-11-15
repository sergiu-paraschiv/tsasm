import { ItemWithValue } from '../parser/ParserGrammarLexemes';
import { Expression, UnaryExpression, BinaryExpression } from './Expression';
import { Block } from './Block';
import { IGrammarBitVisitor } from './IGrammarBitVisitor';
import { IGrammarBit } from './IGrammarBit';
import { CompilerState } from '../CompilerState';


export class IfStatement
    extends ItemWithValue<[
        Expression,
        Block
    ] | [
        Expression,
        Block,
        Block
    ]>
    implements IGrammarBit
{
    public accept(visitor: IGrammarBitVisitor, state: CompilerState): void {
        if (
            this.value[0] instanceof UnaryExpression
            || this.value[0] instanceof BinaryExpression
            || this.value[0] instanceof Block
        ) {
            visitor.visit(this.value[0], state);
        }

        // TODO
    }
}