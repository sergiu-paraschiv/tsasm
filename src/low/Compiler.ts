import { Parser } from './parser/Parser';
import * as S from './grammar/Statement';
import { CompilerASTValidationStep } from './CompilerASTValidationStep';
import { CompilerState } from './CompilerState';
import { CompilerASMGenerationStep } from './CompilerASMGenerationStep';


export class Compiler {
    private parser: Parser;

    constructor() {
        this.parser = new Parser();
    }

    public run(src: string): {
        program: string
    } {
        const statements = this.parse(src);
        const validation = new CompilerASTValidationStep();
        const generation = new CompilerASMGenerationStep();

        validation.run(statements, new CompilerState());

        const code = generation.run(statements, new CompilerState());

        return {
            program: code.join('\n') + '\n'
        };
    }

    private parse(src: string): S.StatementList {
        this.parser.feed(src + '\n');
        return this.parser.finish();
    }
    /*



    private handleStackFrameStart() {
        this.stackIndex = 0;

        this.body.push('PUSH $12'); // save $12 because we'll use $12 as our "stack base" offset for local variables
        this.body.push('MOV $12 $13'); // initially our "stack base" will be the "stack pointer", which is register $13
    }

    private handleStackFrameEnd() {
        this.body.push('POP $12'); // restore $12
    }
*/
}