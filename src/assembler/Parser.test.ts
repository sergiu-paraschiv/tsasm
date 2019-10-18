import { Parser } from './Parser';


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

test('LOAD $1 [100]', () => {
    const parser = new Parser();

    parser.feed('LOAD $1 [100]\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['LOAD', { reg: 1 }, { addr: 100 }]
    ]);
});

test('LOAD $1 [$2]', () => {
    const parser = new Parser();

    parser.feed('LOAD $1 [$2]\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['LOAD', { reg: 1 }, { addr: { reg: 2 } }]
    ]);
});

test('SAVE [100] 10', () => {
    const parser = new Parser();

    parser.feed('SAVE [100] 10\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['SAVE', { addr: 100 }, 10]
    ]);
});

test('SAVE [$1] 10', () => {
    const parser = new Parser();

    parser.feed('SAVE [$1] 10\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['SAVE', { addr: { reg: 1 } }, 10]
    ]);
});

test('SAVE [100] $2', () => {
    const parser = new Parser();

    parser.feed('SAVE [100] $2\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['SAVE', { addr: 100 }, { reg: 2 }]
    ]);
});

test('SAVE [$1] $2', () => {
    const parser = new Parser();

    parser.feed('SAVE [$1] $2\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['SAVE', { addr: { reg: 1 } }, { reg: 2 }]
    ]);
});

test('LOAD $1 [4294967296]', () => {
    const parser = new Parser();

    parser.feed('LOAD $1 [4294967296]\n');

    expect(parser.results.length).toBe(1);
    expect(parser.results[0]).toEqual([
        ['LOAD', { reg: 1 }, { addr: 4294967296 }]
    ]);
});
