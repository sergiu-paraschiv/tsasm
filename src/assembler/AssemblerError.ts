export class AssemblerError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'AssemblerError';
        Object.setPrototypeOf(this, AssemblerError.prototype);
    }
}