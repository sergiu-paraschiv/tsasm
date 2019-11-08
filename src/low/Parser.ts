import { Parser as NParser, Grammar } from 'nearley';
import * as grammar from './grammar';
import { ParserError } from './ParserError';


interface ParserOptions {
    withLineNumbers: boolean
}

export class Parser {
    private np: NParser;
    private readonly withLineNumbers: boolean;

    constructor(options?: ParserOptions) {
        if (options && options.withLineNumbers) {
            this.withLineNumbers = true;
        }

        this.reset();
    }

    public feed(data: string) {
        try {
            this.np.feed(data.replace(/^ +| +$/g, ''));
        }
        catch (error) {
            throw new ParserError(error.message);
        }
    }

    public finish(): any {
        const results = this.np.results;

        if (!results || results.length === 0) {
            throw new ParserError('Parser returned no results');
        }

        if (results.length > 1) {
            console.error('results:', JSON.stringify(results, null, 2));
            throw new ParserError('Ambiguous Parser returned ' + results.length + ' results');
        }

        this.reset();

        return results[0];
    }

    private reset() {
        this.np = (() => {
            const g = Grammar.fromCompiled(grammar);

            if (!this.withLineNumbers) {
                g.rules = g.rules.map(rule => {
                    if (rule.postprocess) {
                        const original = rule.postprocess;
                        rule.postprocess = (data: any[], reference: number, wantedBy: {}): void => {
                            if (data) {
                                for (let i = 0; i < data.length; i++) {
                                    if (
                                        data[i]
                                        && data[i].hasOwnProperty('line')
                                    ) {
                                        data[i].line = undefined;
                                    }
                                }
                            }

                            return original!(data, reference, wantedBy);
                        };
                    }
                    return rule;
                });
            }

            return new NParser(g)
        })();


    }
}