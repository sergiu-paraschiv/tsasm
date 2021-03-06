export class ParserError extends Error {
    public line?: number;
    public col?: number;

    constructor(message: string, line?: number, col?: number) {
        super(message);
        this.name = 'ParserError';
        this.line = line;
        this.col = col;
        Object.setPrototypeOf(this, ParserError.prototype);
    }
}