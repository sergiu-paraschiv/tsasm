import { Parser } from './Parser';
import { Assign, BinOp, Const, Declare, MathOp } from './ParserStatements';
import { CompilerError } from './CompilerError';


type Operation = Declare | Assign | BinOp;

const MIN_INT32 = -Math.pow(2, 16);
const MAX_INT32 = Math.pow(2, 16) - 1;

export class Compiler {
    private parser: Parser;
    private body: string[];
    private symbols: {
        [key: string]: number
    };
    private stackIndex: number;

    constructor() {
        this.parser = new Parser();
    }

    public run(src: string): {
        program: string
    } {
        const lines = this.parse(src);

        this.buildBody(lines);

        const program = this.body.join('\n') + '\n';

        return {
            program
        };
    }

    private buildBody(lines: Operation[]): void {
        this.body = [];
        this.symbols = {};

        this.handleStackFrameStart();

        for (let li = 0; li < lines.length; li++) {
            if (lines[li] === null) {
                continue;
            }

            // console.log(' -> ', lines[li]);
            this.handleOperation(lines[li]);
        }

        this.handleStackFrameEnd();

        this.body.push('HALT');
    }

    private handleOperation(operation: Operation): void {
        if (operation instanceof Declare) {
            this.handleDeclare(operation);
        }
        else if (operation instanceof Assign) {
            this.handleAssign(operation);
        }
    }

    private handleStackFrameStart() {
        this.stackIndex = 0;

        this.body.push('PUSH $12'); // save $12 because we'll use $12 as our "stack base" offset for local variables
        this.body.push('MOV $12 $13'); // initially our "stack base" will be the "stack pointer", which is register $13
    }

    private handleStackFrameEnd() {
        this.body.push('POP $12'); // restore $12
    }

    private handleBinOp(op: BinOp): void {
        if (op.left instanceof BinOp) {
            this.handleBinOp(op.left); // builds result in $1
        }
        else if (op.left instanceof Const) {
            this.body.push('LOAD $1 ' + op.left.value);
        }
        else { // op.left is variable
            this.handleLoadVariableForBinOp(op.left);
        }

        this.body.push('PUSH $1');

        if (op.right instanceof BinOp) {
            this.handleBinOp(op.right); // builds result in $1
        }
        else if (op.right instanceof Const) {
            this.body.push('LOAD $1 ' + op.right.value);
        }
        else { // op.right is variable
            this.handleLoadVariableForBinOp(op.right);
        }

        this.body.push('POP $2');

        if (op.op === MathOp.SUM) {
            this.body.push('ADD $1 $1 $2');
        }
        else if (op.op === MathOp.SUB) {
            this.body.push('SUB $1 $2 $1');
        }
        else if (op.op === MathOp.MUL) {
            this.body.push('MUL $1 $1 $2');
        }
        else if (op.op === MathOp.DIV) {
            this.body.push('DIV $1 $2 $1');
        }
        else if (op.op === MathOp.MOD) {
            // TODO
        }
        else if (op.op === MathOp.EXP) {
            // TODO
        }
    }

    private handleDeclare(op: Declare): void {
        if (this.symbols.hasOwnProperty(op.varName)) {
            throw new CompilerError('Variable `' + op.varName + '` already declared.');
        }

        this.symbols[op.varName] = this.stackIndex;
        this.stackIndex -= 4;

        if (!op.initializer) {
            this.body.push('LOAD $1 0');
            this.body.push('PUSH $1');
        }
        else if (op.initializer instanceof BinOp) {
            this.handleBinOp(op.initializer);
            // BinOp builds result in $1
            this.body.push('PUSH $1');
        }
        else if (op.initializer instanceof Const) {
            this.guardInt32(op.initializer.value);
            const initValue = op.initializer.value;

            this.body.push('LOAD $1 ' + initValue);
            this.body.push('PUSH $1');
        }
        else { // initializer is be variable
            this.body.push('LOAD $1 0');
            this.body.push('PUSH $1');

            this.handleAssign(new Assign(op.varName, op.initializer));
        }
    }

    private handleAssign(op: Assign): void {
        if (!this.symbols.hasOwnProperty(op.varName)) {
            throw new CompilerError('Variable `' + op.varName + '` used before declaration.');
        }

        const toAddr = this.symbols[op.varName];

        if (op.value instanceof BinOp) {
            this.handleBinOp(op.value);
            // BinOp builds result in $1

            this.body.push(`SAVE [$12, ${toAddr}] $1`);
            this.body.push(`SHR $1 $1 8`);
            this.body.push(`SAVE [$12, ${toAddr - 1}] $1`);
            this.body.push(`SHR $1 $1 8`);
            this.body.push(`SAVE [$12, ${toAddr - 2}] $1`);
            this.body.push(`SHR $1 $1 8`);
            this.body.push(`SAVE [$12, ${toAddr - 3}] $1`);

        }
        else if (op.value instanceof Const) {
            this.guardInt32(op.value.value);

            this.body.push(`SAVE [$12, ${toAddr - 3}] ${(op.value.value >>> 24) & 255}`);
            this.body.push(`SAVE [$12, ${toAddr - 2}] ${(op.value.value >>> 16) & 255}`);
            this.body.push(`SAVE [$12, ${toAddr - 1}] ${(op.value.value >>> 8) & 255}`);
            this.body.push(`SAVE [$12, ${toAddr}] ${op.value.value & 255}`);
        }
        else { // assigning variable
            if (!this.symbols.hasOwnProperty(op.value)) {
                throw new CompilerError('Variable `' + op.value + '` used before declaration.');
            }

            const fromAddr = this.symbols[op.value];

            this.body.push(`LOAD [$12, ${fromAddr - 3}] $0`);
            this.body.push(`SAVE [$12, ${toAddr - 3}] $0`);
            this.body.push(`LOAD [$12, ${fromAddr - 2}] $0`);
            this.body.push(`SAVE [$12, ${toAddr - 2}] $0`);
            this.body.push(`LOAD [$12, ${fromAddr - 1}] $0`);
            this.body.push(`SAVE [$12, ${toAddr - 1}] $0`);
            this.body.push(`LOAD [$12, ${fromAddr}] $0`);
            this.body.push(`SAVE [$12, ${toAddr}] $0`);
        }
    }

    private handleLoadVariableForBinOp(varName: string) {
        if (!this.symbols.hasOwnProperty(varName)) {
            throw new CompilerError('Variable `' + varName + '` used before declaration.');
        }

        const fromAddr = this.symbols[varName];

        this.body.push(`LOAD $1 [$12, ${fromAddr - 3}]`);
        this.body.push(`SHL $1 $1 8`);
        this.body.push(`LOAD $1 [$12, ${fromAddr - 2}]`);
        this.body.push(`SHL $1 $1 8`);
        this.body.push(`LOAD $1 [$12, ${fromAddr - 1}]`);
        this.body.push(`SHL $1 $1 8`);
        this.body.push(`LOAD $1 [$12, ${fromAddr}]`);
    }

    private guardInt32(value: number) {
        if (value < MIN_INT32 || value > MAX_INT32) {
            throw new CompilerError('int32 overflow. Found `' + value + '`.');
        }
    }

    private parse(src: string): Operation[] {
        this.parser.feed(src + '\n');
        const results = this.parser.finish();

        if (results.length > 1) {
            throw new CompilerError('Parser returned more than one result. Ambiguous parser!')
        }

        if (results.length < 1) {
            throw new CompilerError('Parser did not return a result. Parsing error!')
        }

        return results[0];
    }
}