import { MemoryError } from './MemoryError';


export class Memory {
    private _data: Uint8Array;

    constructor(size: number) {
        this._data = new Uint8Array(size);
    }

    public get size() {
        return this._data.length;
    }

    public get data(): Uint8Array {
        return this._data;
    }

    public get(index: number) {
        if (index < 0 || index >= this._data.length) {
            throw new MemoryError(`Memory index ${index} out of bounds!`);
        }

        return this._data[index];
    }

    public set(index: number, value: number) {
        if (index < 0 || index >= this._data.length) {
            throw new MemoryError(`Memory index ${index} out of bounds!`);
        }

        this._data[index] = value;
    }
}
