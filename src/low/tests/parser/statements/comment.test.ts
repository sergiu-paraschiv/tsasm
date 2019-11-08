import { Parser } from '../../../Parser';
import * as G from '../../../ParserGrammar';


describe('Parser:statements:comment', () => {
    test('code can contain comments', () => {
        const parser = new Parser();
        let results;

        parser.feed('# foo bar baz\n');

        results = parser.finish();

        expect(results).toStrictEqual([
            new G.Comment(' foo bar baz')
        ]);
    });
});