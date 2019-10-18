export class MemoryError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'MemoryError';
        Object.setPrototypeOf(this, MemoryError.prototype);
    }
}