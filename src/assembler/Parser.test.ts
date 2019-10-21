import { Parser } from './Parser';
import { ParserError } from './ParserError';


test('HALT', () => {
    const parser = new Parser();

    parser.feed('HALT\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        [ 'HALT' ]
    ]);
});

test('JMP $1', () => {
    const parser = new Parser();

    parser.feed('JMP $1\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        [ 'JMP', { reg: 1 } ]
    ]);
});

test('multiline instructions', () => {
    const parser = new Parser();

    parser.feed('HALT\nJMP $1\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        [ 'HALT' ],
        [ 'JMP', { reg: 1 } ]
    ]);
});

test('preserves new lines', () => {
    const parser = new Parser();

    parser.feed('HALT\n\nHALT\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        [ 'HALT' ],
        null,
        [ 'HALT' ]
    ]);
});

test('JMPF $1', () => {
    const parser = new Parser();

    parser.feed('JMPF $1\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['JMPF', { reg: 1 }]
    ]);
});

test('JMPB $1', () => {
    const parser = new Parser();

    parser.feed('JMPB $1\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['JMPB', { reg: 1 }]
    ]);
});

test('LOAD $1 500', () => {
    const parser = new Parser();

    parser.feed('LOAD $1 500\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['LOAD', { reg: 1 }, 500]
    ]);
});

test('ADD $1 $2 $3', () => {
    const parser = new Parser();

    parser.feed('ADD $1 $2 $3\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['ADD', { reg: 1 }, { reg: 2 }, { reg: 3 }]
    ]);
});

test('SUB $1 $2 $3', () => {
    const parser = new Parser();

    parser.feed('SUB $1 $2 $3\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['SUB', { reg: 1 }, { reg: 2 }, { reg: 3 }]
    ]);
});

test('MUL $1 $2 $3', () => {
    const parser = new Parser();

    parser.feed('MUL $1 $2 $3\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['MUL', { reg: 1 }, { reg: 2 }, { reg: 3 }]
    ]);
});

test('DIV $1 $2 $3', () => {
    const parser = new Parser();

    parser.feed('DIV $1 $2 $3\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['DIV', { reg: 1 }, { reg: 2 }, { reg: 3 }]
    ]);
});

test('CMP $1 $2', () => {
    const parser = new Parser();

    parser.feed('CMP $1 $2\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['CMP', { reg: 1 }, { reg: 2 }]
    ]);
});

test('CMPN $1 $2', () => {
    const parser = new Parser();

    parser.feed('CMPN $1 $2\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['CMPN', { reg: 1 }, { reg: 2 }]
    ]);
});

test('CMP $1 100', () => {
    const parser = new Parser();

    parser.feed('CMP $1 100\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['CMP', { reg: 1 }, 100]
    ]);
});

test('CMPN $1 100', () => {
    const parser = new Parser();

    parser.feed('CMPN $1 100\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['CMPN', { reg: 1 }, 100]
    ]);
});

test('JEQ $1', () => {
    const parser = new Parser();

    parser.feed('JEQ $1\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['JEQ', { reg: 1 }]
    ]);
});

test('various whitespace', () => {
    const parser = new Parser();

    parser.feed('JEQ $1\n');
    parser.feed('JEQ    $2\n');
    parser.feed('JEQ $3   \n');
    parser.feed('JEQ $4 \n');
    parser.feed('JEQ    $5   \n');
    parser.feed(' JEQ $6 \n');
    parser.feed('   JEQ    $7   \n');
    parser.feed('JEQ $8\n');
    parser.feed('JEQ $9\n\n\n');
    parser.feed('\n\n\nJEQ $10\n\n\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['JEQ', { reg: 1 }],
        ['JEQ', { reg: 2 }],
        ['JEQ', { reg: 3 }],
        ['JEQ', { reg: 4 }],
        ['JEQ', { reg: 5 }],
        ['JEQ', { reg: 6 }],
        ['JEQ', { reg: 7 }],
        ['JEQ', { reg: 8 }],
        ['JEQ', { reg: 9 }],
        null,
        null,
        null,
        null,
        null,
        ['JEQ', { reg: 10 }],
        null,
        null
    ]);
});

test('various whitespace multiline', () => {
    const parser = new Parser();

    parser.feed('   \n   \nJEQ $1\n   \n  JEQ $2  \n\n     ');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        null,
        null,
        ['JEQ', { reg: 1 }],
        null,
        ['JEQ', { reg: 2 }],
        null
    ]);
});

test('label', () => {
    const parser = new Parser();

    parser.feed('LABEL1: HALT\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        { label: 'LABEL1', op: [ 'HALT' ] }
    ]);
});

test('label with dot prefix', () => {
    const parser = new Parser();

    parser.feed('.X123AAA: HALT\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        { label: '.X123AAA', op: [ 'HALT' ] }
    ]);
});

test('label whitespace', () => {
    const parser = new Parser();

    parser.feed('    LABEL1:     HALT    \n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        { label: 'LABEL1', op: [ 'HALT' ] }
    ]);
});

test('JMP LABEL', () => {
    const parser = new Parser();

    parser.feed('JMP LABEL\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        [ 'JMP', { label: 'LABEL' } ]
    ]);
});

test('various labels', () => {
    const parser = new Parser();

    parser.feed('HALT\nLABEL1: HALT\nLABEL2: JMP $1\nMUL $15 $1 $2\nLABEL3: SUB $2 $3 $4\nJMP FOO\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        [ 'HALT' ],
        { label: 'LABEL1', op: [ 'HALT' ] },
        { label: 'LABEL2', op: [ 'JMP', { reg: 1 } ] },
        [ 'MUL', { reg: 15 }, { reg: 1 }, { reg: 2 } ],
        { label: 'LABEL3', op: [ 'SUB', { reg: 2 }, { reg: 3 }, { reg: 4 } ] },
        [ 'JMP',  { label: 'FOO' } ],
    ]);
});

test('.asciiz', () => {
    const parser = new Parser();

    parser.feed(".asciiz ''\n");
    parser.feed(".asciiz 'x'\n");
    parser.feed(".asciiz 'foo bar baz'\n");

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['.asciiz', ''],
        ['.asciiz', 'x'],
        ['.asciiz', 'foo bar baz']
    ]);
});

test('labeled .asciiz', () => {
    const parser = new Parser();

    parser.feed("FOO: .asciiz 'foo'\n");

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        { label: 'FOO', op: ['.asciiz', 'foo'] },
    ]);
});

test('PUTS LABEL', () => {
    const parser = new Parser();

    parser.feed('PUTS LABEL\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['PUTS',  { label: 'LABEL' }]
    ]);
});

test('LOAD $1 [500]', () => {
    const parser = new Parser();

    parser.feed('LOAD $1 [500]\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['LOAD', { reg: 1 }, { addr: 500, offset: 0 }]
    ]);
});

test('LOAD $1 [100, 127]', () => {
    const parser = new Parser();

    parser.feed('LOAD $1 [100, 127]\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['LOAD', { reg: 1 }, { addr: 100, offset: 127 }]
    ]);
});

test('LOAD $1 [100, -101]', () => {
    const parser = new Parser();

    expect(() => {
        parser.feed('LOAD $1 [100, -101]\n');
    }).toThrowError(ParserError);
});

test('LOAD $1 [100, -99]', () => {
    const parser = new Parser();

    parser.feed('LOAD $1 [100, -99]\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['LOAD', { reg: 1 }, { addr: 100, offset: -99 }]
    ]);
});


test('LOAD $1 [$2]', () => {
    const parser = new Parser();

    parser.feed('LOAD $1 [$2]\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['LOAD', { reg: 1 }, { addr: { reg: 2 }, offset: 0 }]
    ]);
});

test('LOAD $1 [$2, 127]', () => {
    const parser = new Parser();

    parser.feed('LOAD $1 [$2, 127]\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['LOAD', { reg: 1 }, { addr: { reg: 2 }, offset: 127 }]
    ]);
});

test('SAVE [500] 10', () => {
    const parser = new Parser();

    parser.feed('SAVE [500] 10\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['SAVE', { addr: 500, offset: 0 }, 10]
    ]);
});

test('SAVE [100, 127] 10', () => {
    const parser = new Parser();

    parser.feed('SAVE [100, 127] 10\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['SAVE', { addr: 100, offset: 127 }, 10]
    ]);
});

test('SAVE [$1] 10', () => {
    const parser = new Parser();

    parser.feed('SAVE [$1] 10\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['SAVE', { addr: { reg: 1 }, offset: 0 }, 10]
    ]);
});

test('SAVE [$1, 127] 10', () => {
    const parser = new Parser();

    parser.feed('SAVE [$1, 127] 10\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['SAVE', { addr: { reg: 1 }, offset: 127 }, 10]
    ]);
});

test('SAVE [500] $2', () => {
    const parser = new Parser();

    parser.feed('SAVE [500] $2\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['SAVE', { addr: 500, offset: 0 }, { reg: 2 }]
    ]);
});

test('SAVE [100, 127] $2', () => {
    const parser = new Parser();

    parser.feed('SAVE [100, 127] $2\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['SAVE', { addr: 100, offset: 127 }, { reg: 2 }]
    ]);
});

test('SAVE [$1] $2', () => {
    const parser = new Parser();

    parser.feed('SAVE [$1] $2\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['SAVE', { addr: { reg: 1 }, offset: 0 }, { reg: 2 }]
    ]);
});

test('SAVE [$1, 127] $2', () => {
    const parser = new Parser();

    parser.feed('SAVE [$1, 127] $2\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['SAVE', { addr: { reg: 1 }, offset: 127 }, { reg: 2 }]
    ]);
});

test('LOAD $1 [255, 127]', () => {
    const parser = new Parser();

    parser.feed('LOAD $1 [255, 127]\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['LOAD', { reg: 1 }, { addr: 255, offset: 127 }]
    ]);
});

test('PUSH $1', () => {
    const parser = new Parser();

    parser.feed('PUSH $1\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['PUSH', { reg: 1 }]
    ]);
});

test('POP $1', () => {
    const parser = new Parser();

    parser.feed('POP $1\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['POP', { reg: 1 }]
    ]);
});

test('PUSH { $1 }', () => {
    const parser = new Parser();

    parser.feed('PUSH { $1 }\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['PUSH', { reglist: [ 1 ] }]
    ]);
});

test('POP { $1 }', () => {
    const parser = new Parser();

    parser.feed('POP { $1 }\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['POP', { reglist: [ 1 ] }]
    ]);
});

test('PUSH { $5 $2 $1 $0 }', () => {
    const parser = new Parser();

    parser.feed('PUSH { $5 $2 $1 $0 }\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['PUSH', { reglist: [ 5, 2, 1, 0 ] }]
    ]);
});

test('PUSH { $0 $1 $2 $3 $10 }', () => {
    const parser = new Parser();

    parser.feed('PUSH { $0 $1 $2 $3 $10 }\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['PUSH', { reglist: [ 0, 1, 2, 3, 10 ] }]
    ]);
});

test('PUSH { $0 $1 $2 $3 $4 $5 }', () => {
    const parser = new Parser();

    expect(() => {
        parser.feed('PUSH { $0 $1 $2 $3 $4 $5 }\n');
    }).toThrowError(ParserError);
});

test('POP { $0 1 $2 $3 $10 }', () => {
    const parser = new Parser();

    parser.feed('POP { $0 $1 $2 $3 $10 }\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['POP', { reglist: [ 0, 1, 2, 3, 10 ] }]
    ]);
});

test('CALL LABEL', () => {
    const parser = new Parser();

    parser.feed('CALL LABEL\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['CALL', { label: 'LABEL' }]
    ]);
});

test('RET', () => {
    const parser = new Parser();

    parser.feed('RET\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['RET']
    ]);
});

test('LOAD $1 1 + 2', () => {
    const parser = new Parser();

    parser.feed('LOAD $1 1 + 2\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['LOAD', { reg: 1 }, 1 + 2]
    ]);
});

test('LOAD $1 2 * 2', () => {
    const parser = new Parser();

    parser.feed('LOAD $1 2 * 2\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['LOAD', { reg: 1 }, 2 * 2]
    ]);
});

test('LOAD $1 2 ^ 3', () => {
    const parser = new Parser();

    parser.feed('LOAD $1 2 ^ 3\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['LOAD', { reg: 1 }, Math.pow(2, 3)]
    ]);
});

test('LOAD $1 2 - 1', () => {
    const parser = new Parser();

    parser.feed('LOAD $1 2 - 1\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['LOAD', { reg: 1 }, 2 - 1]
    ]);
});

test('LOAD $1 4 / 2', () => {
    const parser = new Parser();

    parser.feed('LOAD $1 4 / 2\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['LOAD', { reg: 1 }, 4 / 2]
    ]);
});

test('LOAD $1 1 + 2 + 3', () => {
    const parser = new Parser();

    parser.feed('LOAD $1 1 + 2 + 3\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['LOAD', { reg: 1 }, 1 + 2 + 3]
    ]);
});

test('LOAD $1 1 * 2 + 3', () => {
    const parser = new Parser();

    parser.feed('LOAD $1 1 * 2 + 3\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['LOAD', { reg: 1 }, 1 * 2 + 3]
    ]);
});

test('LOAD $1 1 + 2 * 3', () => {
    const parser = new Parser();

    parser.feed('LOAD $1 1 + 2 * 3\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['LOAD', { reg: 1 }, 1 + 2 * 3]
    ]);
});

test('LOAD $1 4 / 2 * 2', () => {
    const parser = new Parser();

    parser.feed('LOAD $1 4 / 2 * 2\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['LOAD', { reg: 1 }, 4 / 2 * 2]
    ]);
});

test('LOAD $1 2 ^ 3 * 2 + 3', () => {
    const parser = new Parser();

    parser.feed('LOAD $1 2 ^ 3 * 2 + 3\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['LOAD', { reg: 1 }, Math.pow(2, 3) * 2 + 3]
    ]);
});

test('LOAD $1 3 + 2 * 3 ^ 2', () => {
    const parser = new Parser();

    parser.feed('LOAD $1 3 + 2 * 3 ^ 2\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['LOAD', { reg: 1 }, 3 + 2 * Math.pow(3, 2)]
    ]);
});

test('SAVE [$1] -129', () => {
    const parser = new Parser();

    expect(() => {
        parser.feed('SAVE [$1] -129\n');
    }).toThrowError(ParserError);
});

test('LOAD $1 -1', () => {
    const parser = new Parser();

    parser.feed('LOAD $1 -1\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['LOAD', { reg: 1 }, -1]
    ]);
});

test('SAVE [$1] 0', () => {
    const parser = new Parser();

    parser.feed('SAVE [$1] 0\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['SAVE', { addr: { reg: 1 }, offset: 0 }, 0]
    ]);
});

test('SAVE [$1] 127', () => {
    const parser = new Parser();

    parser.feed('SAVE [$1] 127\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['SAVE', { addr: { reg: 1 }, offset: 0 }, 127]
    ]);
});

test('SAVE [$1] 128', () => {
    const parser = new Parser();

    expect(() => {
        parser.feed('SAVE [$1] 128\n');
    }).toThrowError(ParserError);
});

test('SAVE [$1, -129] 0', () => {
    const parser = new Parser();

    expect(() => {
        parser.feed('SAVE [$1, -129] 0\n');
    }).toThrowError(ParserError);
});

test('SAVE [$1, 128] 0', () => {
    const parser = new Parser();

    expect(() => {
        parser.feed('SAVE [$1, 128] 0\n');
    }).toThrowError(ParserError);
});

test('SAVE [-1, 0] 0', () => {
    const parser = new Parser();

    expect(() => {
        parser.feed('SAVE [-1, 0] 0\n');
    }).toThrowError(ParserError);
});

test('SAVE [256, 0] 0', () => {
    const parser = new Parser();

    expect(() => {
        parser.feed('SAVE [256, 0] 0\n');
    }).toThrowError(ParserError);
});

test('SAVE [-1] 0', () => {
    const parser = new Parser();

    expect(() => {
        parser.feed('SAVE [-1] 0\n');
    }).toThrowError(ParserError);
});

test('SAVE [65536] 0', () => {
    const parser = new Parser();

    expect(() => {
        parser.feed('SAVE [65536] 0\n');
    }).toThrowError(ParserError);
});

test('LOAD $1 -32769', () => {
    const parser = new Parser();

    expect(() => {
        parser.feed('LOAD $1 -32769\n');
    }).toThrowError(ParserError);
});

test('LOAD $1 32768', () => {
    const parser = new Parser();

    expect(() => {
        parser.feed('LOAD $1 32768\n');
    }).toThrowError(ParserError);
});

test('ADD $1 127 $2', () => {
    const parser = new Parser();

    parser.feed('ADD $1 127 $2\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['ADD', { reg: 1 }, 127, { reg: 2 }]
    ]);
});

test('SUB $1 127 $2', () => {
    const parser = new Parser();

    parser.feed('SUB $1 127 $2\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['SUB', { reg: 1 }, 127, { reg: 2 }]
    ]);
});

test('MUL $1 127 $2', () => {
    const parser = new Parser();

    parser.feed('MUL $1 127 $2\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['MUL', { reg: 1 }, 127, { reg: 2 }]
    ]);
});

test('DIV $1 127 $2', () => {
    const parser = new Parser();

    parser.feed('DIV $1 127 $2\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['DIV', { reg: 1 }, 127, { reg: 2 }]
    ]);
});

test('INC $1', () => {
    const parser = new Parser();

    parser.feed('INC $1\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['INC', { reg: 1 }]
    ]);
});

test('DEC $1', () => {
    const parser = new Parser();

    parser.feed('DEC $1\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['DEC', { reg: 1 }]
    ]);
});