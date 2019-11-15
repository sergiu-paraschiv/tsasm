import { Parser } from '../../../parser/Parser';
import * as L from '../../../parser/ParserGrammarLexemes';
import * as E from '../../../grammar/Expression';
import * as S from '../../../grammar/Statement';


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
            new S.VarDeclaration([ L.BasicType.INT, new L.VarName('a') ]),
            new S.VarDeclaration([ L.BasicType.INT, new L.VarName('A') ]),
            new S.VarDeclaration([ L.BasicType.INT, new L.VarName('a1') ]),
            new S.VarDeclaration([ L.BasicType.INT, new L.VarName('_a') ]),
            new S.VarDeclaration([ L.BasicType.INT, new L.VarName('_1') ]),
            new S.VarDeclaration([ L.BasicType.INT, new L.VarName('_1_2_foo') ]),
            new S.VarDeclaration([ L.BasicType.INT, new L.VarName('fooBarBaz') ]),
            new S.VarDeclaration([ L.BasicType.BOOL, new L.VarName('a') ])
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
        parser.feed('int a := b\n');

        results = parser.finish();

        expect(results).toStrictEqual([
            new S.VarDeclaration([ L.BasicType.INT, new L.VarName('a'), new L.IntegerLiteral(1) ]),
            new S.VarDeclaration([ L.BasicType.INT, new L.VarName('a'), new L.IntegerLiteral(2) ]),
            new S.VarDeclaration([ L.BasicType.BOOL, new L.VarName('a'), new L.BooleanLiteral(false) ]),
            new S.VarDeclaration([ L.BasicType.INT, new L.VarName('a'),
                new E.BinaryExpression([
                    L.BinaryIntegerOperator.ADD,
                    new L.IntegerLiteral(1),
                    new L.IntegerLiteral(2)
                ])
            ]),
            new S.VarDeclaration([ L.BasicType.INT, new L.VarName('a'), new L.VarName('b') ])
        ]);
    });

    test('whitespace', () => {
        const parser = new Parser();
        let results;

        parser.feed('int    a   \n');

        results = parser.finish();

        expect(results).toStrictEqual([
            new S.VarDeclaration([ L.BasicType.INT, new L.VarName('a') ])
        ]);

        expect(() => {
            parser.feed('int \n a\n');
        }).toThrowError('Syntax error at line 1');
    });
});