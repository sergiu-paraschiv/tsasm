import { IGrammarBitVisitor } from './IGrammarBitVisitor';
import { IGrammarBit } from './IGrammarBit';
import { ItemWithValue } from '../parser/ParserGrammarLexemes';
import { StatementList } from './Statement';
import { CompilerState } from '../CompilerState';


export class Block
    extends ItemWithValue<StatementList>
    implements IGrammarBit
{
    public accept(visitor: IGrammarBitVisitor, state: CompilerState): void {
        // TODO
        this.value.forEach(value => visitor.visit(value, state));
    }
}