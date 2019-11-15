import { IGrammarBitVisitor } from './grammar/IGrammarBitVisitor';
import { IGrammarBit } from './grammar/IGrammarBit';
import { CompilerState } from './CompilerState';
import { CompilerError } from './CompilerError';


const MIN_INT32 = -Math.pow(2, 16);
const MAX_INT32 = Math.pow(2, 16) - 1;

export class CompilerASTValidationStep implements IGrammarBitVisitor {
    public run(statements: IGrammarBit[], state: CompilerState) {
        for (let i = 0; i < statements.length; i++) {
            this.visit(statements[i], state);
        }
    }

    public visit(bit: IGrammarBit, state: CompilerState): void {
        bit.accept(this, state);
    }

    public guardInt32Overflow(value: number) {
        if (value < MIN_INT32 || value > MAX_INT32) {
            throw new CompilerError('int32 overflow. Found `' + value + '`.');
        }
    }
    //
    //
    // private visitUnaryExpression(ex: E.UnaryExpression, state: CompilerState): void {
    //     if (ex.value[1] instanceof VarName) {
    //         const symbol = state.getStackSymbol(ex.value[1]);
    //     }
    // }
    //
    // private visitBinaryExpression(ex: E.BinaryExpression, state: CompilerState): void {
    //
    // }


}