import * as L from '../parser/ParserGrammarLexemes';
import { CompilerState } from '../CompilerState';
import { CompilerASTValidationStep } from '../CompilerASTValidationStep';
import { CompilerASMGenerationStep } from '../CompilerASMGenerationStep';
import * as E from './Expression';
import { IGrammarBitVisitor } from './IGrammarBitVisitor';
import { IGrammarBit } from './IGrammarBit';
import { VarAssignment } from './VarAssignment';


export class VarDeclaration
    extends L.ItemWithValue<[
        L.BasicType,
        L.VarName
    ] | [
        L.BasicType,
        L.VarName,
        E.Expression
    ]>
    implements IGrammarBit
{
    public accept(visitor: IGrammarBitVisitor, state: CompilerState): void {
        if (
            this.value.length === 3
            && (
                this.value[2] instanceof E.UnaryExpression
                || this.value[2] instanceof E.BinaryExpression
            )
        ) {
            visitor.visit(this.value[2], state);
        }

        if (visitor instanceof CompilerASTValidationStep) {
            if (this.value.length === 3) {
               if (this.value[2] instanceof L.VarName) {
                   state.getStackSymbol(this.value[2]);
               }
               else if (this.value[2] instanceof L.IntegerLiteral) {
                   visitor.guardInt32Overflow(this.value[2].value);
               }
            }
        }

        if (
            visitor instanceof CompilerASTValidationStep
            || visitor instanceof CompilerASMGenerationStep
        ) {
            state.declareStackSymbol(this.value[0], this.value[1]);
        }

        if (visitor instanceof CompilerASMGenerationStep) {
            // TODO: refactor this conditional mess
            if (
                this.value.length === 3
                && (
                    this.value[2] instanceof E.UnaryExpression
                    || this.value[2] instanceof E.BinaryExpression
                )
            ) {
                visitor.pushLine('PUSH $1');
            }
            else {
                let initValue = 0;
                if (this.value.length === 3) {
                    if (this.value[2] instanceof L.IntegerLiteral) {
                        initValue = this.value[2].value;
                    }
                    else if (this.value[2] instanceof L.BooleanLiteral) {
                        initValue = this.value[2].value ? 1 : 0;
                    }
                }

                visitor.pushLine('LOAD $1 ' + initValue);
                visitor.pushLine('PUSH $1');
            }
        }

        if (
            this.value.length === 3
            && this.value[2] instanceof L.VarName
        ) {
            visitor.visit(new VarAssignment([ this.value[1], this.value[2] ]), state);
        }
    }
}