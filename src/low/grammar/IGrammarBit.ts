import { IGrammarBitVisitor } from './IGrammarBitVisitor';
import { CompilerState } from '../CompilerState';


export interface IGrammarBit {
    accept(visitor: IGrammarBitVisitor, state: CompilerState): void;
}