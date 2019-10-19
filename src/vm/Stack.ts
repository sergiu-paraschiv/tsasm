import { StackError } from './StackError';


interface StackItem {
    value: number,
    prev: undefined | StackItem;
}

export class Stack {
    private _maxSize: number;
    private _size: number;
    private _pointer: undefined | StackItem;

    constructor(size: number) {
        this._maxSize = size;
        this._size = 0;
        this._pointer = undefined;
    }

    public get pointer(): undefined | StackItem {
        return this._pointer;
    }

    public push(value: number) {
        if (this._size >= this._maxSize) {
            throw new StackError(`Stack overflow! Max size is ${this._maxSize}.`);
        }

        const newPointer: StackItem = {
            value: value,
            prev: this._pointer
        };

        this._pointer = newPointer;

        this._size += 1;
    }

    public pop(): number {
        if (this._size <= 0) {
            throw new StackError('Stack is empty!');
        }

        const value = this._pointer!.value;

        this._pointer = this._pointer!.prev;

        this._size -= 1;

        return value;
    }
}
