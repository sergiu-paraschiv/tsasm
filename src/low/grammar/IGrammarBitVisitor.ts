import { IGrammarBit } from './IGrammarBit';
import { CompilerState } from '../CompilerState';


export interface IGrammarBitVisitor {
    run(statements: IGrammarBit[], state: CompilerState) : void;

    visit(bit: IGrammarBit, state: CompilerState): void;
}

