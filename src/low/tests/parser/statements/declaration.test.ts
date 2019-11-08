import { Parser } from '../../../Parser';
import * as G from '../../../ParserGrammar';


describe('Parser:statements:declaration', () => {
    test('variable declaration', () => {
        const parser = new Parser();
        let results;

        parser.feed('int a\n');
        parser.feed('int A\n');
        parser.feed('int a1\n');
        parser.feed('int _a\n');
        parser.feed('int _1\n');
        parser.feed('int _1_2_foo\n');
        parser.feed('int fooBarBaz\n');
        parser.feed('bool a\n');

        results = parser.finish();

        expect(results).toStrictEqual([
            new G.VarDeclaration([ G.BasicType.INT, new G.VarName('a') ]),
            new G.VarDeclaration([ G.BasicType.INT, new G.VarName('A') ]),
            new G.VarDeclaration([ G.BasicType.INT, new G.VarName('a1') ]),
            new G.VarDeclaration([ G.BasicType.INT, new G.VarName('_a') ]),
            new G.VarDeclaration([ G.BasicType.INT, new G.VarName('_1') ]),
            new G.VarDeclaration([ G.BasicType.INT, new G.VarName('_1_2_foo') ]),
            new G.VarDeclaration([ G.BasicType.INT, new G.VarName('fooBarBaz') ]),
            new G.VarDeclaration([ G.BasicType.BOOL, new G.VarName('a') ])
        ]);
    });

    test('variable declaration has to start with letter or underscore', () => {
        const parser = new Parser();

        expect(() => {
            parser.feed('int 0\n');
        }).toThrowError('Syntax error at line 1');

        expect(() => {
            parser.feed('int %\n');
        }).toThrowError('Syntax error at line 1');
    });

    test('variable declaration with initialization', () => {
        const parser = new Parser();
        let results;

        parser.feed('int a := 1\n');
        parser.feed('int a := 2\n');
        parser.feed('bool a := false\n');
        parser.feed('int a := 1 + 2\n');

        results = parser.finish();

        expect(results).toStrictEqual([
            new G.VarAssignment([ new G.VarDeclaration([ G.BasicType.INT, new G.VarName('a') ]), new G.IntegerLiteral(1) ]),
            new G.VarAssignment([ new G.VarDeclaration([ G.BasicType.INT, new G.VarName('a') ]), new G.IntegerLiteral(2) ]),
            new G.VarAssignment([ new G.VarDeclaration([ G.BasicType.BOOL, new G.VarName('a') ]), new G.BooleanLiteral(false) ]),
            new G.VarAssignment([ new G.VarDeclaration([ G.BasicType.INT, new G.VarName('a') ]),
                new G.BinaryExpression([
                    G.BinaryIntegerOperator.ADD,
                    new G.IntegerLiteral(1),
                    new G.IntegerLiteral(2)
                ])
            ])
        ]);
    });

    test('whitespace', () => {
        const parser = new Parser();
        let results;

        parser.feed('int    a   \n');

        results = parser.finish();

        expect(results).toStrictEqual([
            new G.VarDeclaration([ G.BasicType.INT, new G.VarName('a') ])
        ]);

        expect(() => {
            parser.feed('int \n a\n');
        }).toThrowError('Syntax error at line 1');
    });
});