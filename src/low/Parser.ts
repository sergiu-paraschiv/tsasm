import { Parser as NParser, Grammar } from 'nearley';
import * as grammar from './grammar';
import { ParserError } from './ParserError';


export class Parser {
    private np: NParser;

    constructor() {
        this.finish();
    }

    public feed(data: string) {
        try {
            this.np.feed(data.replace(/^ +| +$/g, ''));
        }
        catch (error) {
            const rx = /at line (\d+) col (\d+)\:/;

            const errorInfo = rx.exec(error.message);

            if (errorInfo && errorInfo.length === 3) {
                throw new ParserError('Invalid syntax', parseInt(errorInfo[1], 10), parseInt(errorInfo[2], 10));
            }

            throw new ParserError(error.message);
        }
    }

    public finish(): any {
        let results;
        if (this.np) {
            results = this.np.results;
        }

        this.np = new NParser(Grammar.fromCompiled(grammar));

        return results;
    }
}