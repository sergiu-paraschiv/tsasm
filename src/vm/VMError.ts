export class VMError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'VMError';
        Object.setPrototypeOf(this, VMError.prototype);
    }
}