import * as L from '../parser/ParserGrammarLexemes';
import { BinaryExpression, UnaryExpression, Expression } from './Expression';
import { IGrammarBit } from './IGrammarBit';
import { IGrammarBitVisitor } from './IGrammarBitVisitor';
import { CompilerState } from '../CompilerState';
import { CompilerError } from '../CompilerError';
import { CompilerASTValidationStep } from '../CompilerASTValidationStep';
import { CompilerASMGenerationStep } from '../CompilerASMGenerationStep';


export class VarAssignment
    extends L.ItemWithValue<[
        L.VarName,
        L.VarName | Expression
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

        let assignee = state.getStackSymbol(this.value[0]);

        if (visitor instanceof CompilerASTValidationStep) {
            if (this.value[1] instanceof L.VarName) {
                const assigned = state.getStackSymbol(this.value[1]);
                if (assigned.type !== assignee.type) {
                    throw new CompilerError('Cannot assign `' + assigned.type + ' ' + assigned.name + '` to `' + assignee.type + ' ' + assignee.name + '`.');
                }
            }
            else if (this.value[1] instanceof L.IntegerLiteral) {
                visitor.guardInt32Overflow(this.value[1].value);
            }

            if (
                this.value[1] instanceof L.BooleanLiteral
                && assignee.type !== L.BasicType.BOOL
            ) {
                throw new CompilerError('Cannot assign `bool ' + this.value[1].value + '` to `' + assignee.type + ' ' + assignee.name + '`.');
            }

            if (
                this.value[1] instanceof L.IntegerLiteral
                && assignee.type !== L.BasicType.INT
            ) {
                throw new CompilerError('Cannot assign `int ' + this.value[1].value + '` to `' + assignee.type + ' ' + assignee.name + '`.');
            }
        }
        
        if (visitor instanceof CompilerASMGenerationStep) {
            if (this.value[1] instanceof L.IntegerLiteral) {
                visitor.pushLine(`SAVE [$12, ${assignee.stackIndex - 3}] ${(this.value[1].value >>> 24) & 255}`);
                visitor.pushLine(`SAVE [$12, ${assignee.stackIndex - 2}] ${(this.value[1].value >>> 16) & 255}`);
                visitor.pushLine(`SAVE [$12, ${assignee.stackIndex - 1}] ${(this.value[1].value >>> 8) & 255}`);
                visitor.pushLine(`SAVE [$12, ${assignee.stackIndex}] ${this.value[1].value & 255}`);
            }
            else if (this.value[1] instanceof L.BooleanLiteral) {
                visitor.pushLine(`SAVE [$12, ${assignee.stackIndex - 3}] 0`);
                visitor.pushLine(`SAVE [$12, ${assignee.stackIndex - 2}] 0`);
                visitor.pushLine(`SAVE [$12, ${assignee.stackIndex - 1}] 0`);
                visitor.pushLine(`SAVE [$12, ${assignee.stackIndex}] ${(this.value[1].value === true) ? 1 : 0}`);
            }
            else if (this.value[1] instanceof L.VarName) {
                const assigned = state.getStackSymbol(this.value[1]);

                visitor.pushLine(`LOAD [$12, ${assigned.stackIndex - 3}] $0`);
                visitor.pushLine(`SAVE [$12, ${assignee.stackIndex - 3}] $0`);
                visitor.pushLine(`LOAD [$12, ${assigned.stackIndex - 2}] $0`);
                visitor.pushLine(`SAVE [$12, ${assignee.stackIndex - 2}] $0`);
                visitor.pushLine(`LOAD [$12, ${assigned.stackIndex - 1}] $0`);
                visitor.pushLine(`SAVE [$12, ${assignee.stackIndex - 1}] $0`);
                visitor.pushLine(`LOAD [$12, ${assigned.stackIndex}] $0`);
                visitor.pushLine(`SAVE [$12, ${assignee.stackIndex}] $0`);
            }
            else { // UnaryExpression or BinaryExpression that built the result in $1
                visitor.pushLine(`SAVE [$12, ${assignee.stackIndex}] $1`);
                visitor.pushLine(`SHR $1 $1 8`);
                visitor.pushLine(`SAVE [$12, ${assignee.stackIndex - 1}] $1`);
                visitor.pushLine(`SHR $1 $1 8`);
                visitor.pushLine(`SAVE [$12, ${assignee.stackIndex - 2}] $1`);
                visitor.pushLine(`SHR $1 $1 8`);
                visitor.pushLine(`SAVE [$12, ${assignee.stackIndex - 3}] $1`);
            }
        }
    }
}