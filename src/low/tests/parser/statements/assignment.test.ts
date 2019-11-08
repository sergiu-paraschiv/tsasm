import { Parser } from '../../../Parser';
import * as G from '../../../ParserGrammar';



describe('Parser:statements:assignment', () => {
    test('variable assignment to other variable', () => {
        const parser = new Parser();
        let results;

        parser.feed('a := b\n');

        results = parser.finish();

        expect(results).toStrictEqual([
            new G.VarAssignment([ new G.VarName('a'), new G.VarName('b') ])
        ]);
    });

    test('whitespace', () => {
        const parser = new Parser();
        let results;

        parser.feed('   a    :=    b   \n');

        results = parser.finish();

        expect(results).toStrictEqual([
            new G.VarAssignment([ new G.VarName('a'), new G.VarName('b') ])
        ]);

        parser.feed('   a    \n :=  \n  b   \n');

        results = parser.finish();

        expect(results).toStrictEqual([
            new G.VarAssignment([ new G.VarName('a'), new G.VarName('b') ])
        ]);

        parser.feed('a :=     b     ||     c    \n');

        results = parser.finish();

        expect(results).toStrictEqual([
            new G.VarAssignment([
                new G.VarName('a'),
                new G.BinaryExpression([
                    G.BinaryBooleanOperator.OR,
                    new G.VarName('b'),
                    new G.VarName('c')
                ])
            ])
        ]);

        parser.feed('a :=   \n  b   \n  ||  \n   c    \n');

        results = parser.finish();

        expect(results).toStrictEqual([
            new G.VarAssignment([
                new G.VarName('a'),
                new G.BinaryExpression([
                    G.BinaryBooleanOperator.OR,
                    new G.VarName('b'),
                    new G.VarName('c')
                ])
            ])
        ]);
    });
});
