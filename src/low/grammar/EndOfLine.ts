import { IGrammarBitVisitor } from './IGrammarBitVisitor';
import { IGrammarBit } from './IGrammarBit';
import { Item } from '../parser/ParserGrammarLexemes';
import { CompilerState } from '../CompilerState';


export class EndOfLine extends Item implements IGrammarBit {
    public accept(visitor: IGrammarBitVisitor, state: CompilerState): void {
        visitor;
        state;
        // do nothing
    }
}