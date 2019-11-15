import { ItemWithValue } from '../parser/ParserGrammarLexemes';
import { IGrammarBitVisitor } from './IGrammarBitVisitor';
import { IGrammarBit } from './IGrammarBit';
import { CompilerState } from '../CompilerState';


export class Comment extends ItemWithValue<string> implements IGrammarBit {
    public accept(visitor: IGrammarBitVisitor, state: CompilerState): void {
        visitor;
        state;
        // do nothing
    }
}
