import { CompilerError } from './CompilerError';
import * as L from './parser/ParserGrammarLexemes';


interface StackSymbolInfo {
    type: L.BasicType
    name: string
    stackIndex: number
}

export class CompilerState {
    private stackSymbols: {
        [key: string]: StackSymbolInfo
    };
    private stackIndex: number;

    constructor() {
        this.stackSymbols = {};
        this.stackIndex = 0;
    }

    public declareStackSymbol(type: L.BasicType, symbol: L.VarName) {
        if (this.stackSymbols.hasOwnProperty(symbol.value)) {
            throw new CompilerError('Variable `' + symbol.value + '` already declared.');
        }

        this.stackSymbols[symbol.value] = {
            type,
            name: symbol.value,
            stackIndex: this.stackIndex
        };

        this.stackIndex -= 4;
    }

    public getStackSymbol(symbol: L.VarName): StackSymbolInfo {
        if (!this.stackSymbols.hasOwnProperty(symbol.value)) {
            throw new CompilerError('Variable `' + symbol.value + '` was not declared.');
        }

        return this.stackSymbols[symbol.value];
    }
}