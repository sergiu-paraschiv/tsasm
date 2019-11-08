import { LexerItem } from './ParserGrammar';


export function val(items: (LexerItem<string> | string)[]): string {
    return items.join('');
}

export function int(item: LexerItem<string> | string): LexerItem<number> | number {
    if ((item as any).hasOwnProperty('value')) {
        (item as any).value = parseInt((item as any).value, 10);
        return item as any as LexerItem<number>;
    }

    return parseInt(item as string, 10);
}

export function bool(item: LexerItem<string> | string): LexerItem<boolean> | boolean {
    if ((item as any).hasOwnProperty('value')) {
        (item as any).value = (item as any).value === 'true';
        return item as any as LexerItem<boolean>;
    }

    return (item as string) === 'true';
}