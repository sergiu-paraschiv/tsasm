import { IGrammarBitVisitor } from './grammar/IGrammarBitVisitor';
import { IGrammarBit } from './grammar/IGrammarBit';
import { CompilerState } from './CompilerState';


export class CompilerASMGenerationStep implements IGrammarBitVisitor {
    private codeLines: string[];

    public run(statements: IGrammarBit[], state: CompilerState): string[] {
        this.codeLines = [];

        for (let i = 0; i < statements.length; i++) {
            this.visit(statements[i], state);
        }

        return this.codeLines;
    }

    public visit(bit: IGrammarBit, state: CompilerState): void
    {
        bit.accept(this, state);
    }

    public pushLine(line: string): void {
        this.codeLines.push(line);
    }
}