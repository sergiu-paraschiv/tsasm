import { Parser } from '../../../parser/Parser';
import * as S from '../../../grammar/Statement';


describe('Parser:statements:comment', () => {
    test('code can contain comments', () => {
        const parser = new Parser();
        let results;

        parser.feed('# foo bar baz\n');

        results = parser.finish();

        expect(results).toStrictEqual([
            new S.Comment(' foo bar baz')
        ]);
    });
});