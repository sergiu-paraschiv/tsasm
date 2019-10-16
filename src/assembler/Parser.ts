import { Parser as NParser, Grammar } from 'nearley';
import * as grammar from './grammar';
import { ParserError } from './ParserError';


export class Parser {
    private np: NParser;
    public results: any;

    constructor() {
        this.np = new NParser(Grammar.fromCompiled(grammar));
        this.results = this.np.results;
    }

    public feed(data: string) {
        try {
            this.np.feed(data.replace(/^ +| +$/g, ''));
            this.results = this.np.results;
        }
        catch (error) {
            const rx = /Syntax error at line (\d+) col (\d+)\:/;

            const errorInfo = rx.exec(error.message);

            if (errorInfo && errorInfo.length === 3) {
                throw new ParserError(error.message, parseInt(errorInfo[1], 10), parseInt(errorInfo[2], 10));
            }

            throw new ParserError(error.message);
        }
    }
}