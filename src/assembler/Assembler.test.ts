import { Assembler } from './Assembler';
import { ID_HEADER, Opcode } from '../Instruction';


test('HALT', () => {
    const assembler = new Assembler();

    const data = assembler.run('HALT');

    expect(data.program).toEqual(new Uint8Array([
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.HALT, 0, 0, 0
    ]));
});

test('LOAD', () => {
    const assembler = new Assembler();

    const data = assembler.run('LOAD $15 500');

    expect(data.program).toEqual(new Uint8Array([
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.LOAD, 15, 1, 244
    ]));
});


test('HALT + LOAD', () => {
    const assembler = new Assembler();

    const data = assembler.run(`
        HALT
        LOAD $15 500
    `);

    expect(data.program).toEqual(new Uint8Array([
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.HALT, 0, 0, 0,
        Opcode.LOAD, 15, 1, 244
    ]));
});

test('ADD', () => {
    const assembler = new Assembler();

    const data = assembler.run('ADD $1 $2 $3');

    expect(data.program).toEqual(new Uint8Array([
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.ADD, 1, 2, 3
    ]));
});

test('SUB', () => {
    const assembler = new Assembler();

    const data = assembler.run('SUB $1 $2 $3');

    expect(data.program).toEqual(new Uint8Array([
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.SUB, 1, 2, 3
    ]));
});

test('MUL', () => {
    const assembler = new Assembler();

    const data = assembler.run('MUL $1 $2 $3');

    expect(data.program).toEqual(new Uint8Array([
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.MUL, 1, 2, 3
    ]));
});

test('DIV', () => {
    const assembler = new Assembler();

    const data = assembler.run('DIV $1 $2 $3');

    expect(data.program).toEqual(new Uint8Array([
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.DIV, 1, 2, 3
    ]));
});

test('JMP', () => {
    const assembler = new Assembler();

    const data = assembler.run('JMP $1');

    expect(data.program).toEqual(new Uint8Array([
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.JMP, 1, 0, 0
    ]));
});

test('JMPF', () => {
    const assembler = new Assembler();

    const data = assembler.run('JMPF $1');

    expect(data.program).toEqual(new Uint8Array([
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.JMPF, 1, 0, 0
    ]));
});

test('JMPB', () => {
    const assembler = new Assembler();

    const data = assembler.run('JMPB $1');

    expect(data.program).toEqual(new Uint8Array([
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.JMPB, 1, 0, 0
    ]));
});

test('CMP', () => {
    const assembler = new Assembler();

    const data = assembler.run('CMP $1 $2');

    expect(data.program).toEqual(new Uint8Array([
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.CMP, 1, 2, 0
    ]));
});

test('JEQ', () => {
    const assembler = new Assembler();

    const data = assembler.run('JEQ $1');

    expect(data.program).toEqual(new Uint8Array([
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.JEQ, 1, 0, 0
    ]));
});

test('JNEQ', () => {
    const assembler = new Assembler();

    const data = assembler.run('JNEQ $1');

    expect(data.program).toEqual(new Uint8Array([
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.JNEQ, 1, 0, 0
    ]));
});

test('JGT', () => {
    const assembler = new Assembler();

    const data = assembler.run('JGT $1');

    expect(data.program).toEqual(new Uint8Array([
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.JGT, 1, 0, 0
    ]));
});

test('JLT', () => {
    const assembler = new Assembler();

    const data = assembler.run('JLT $1');

    expect(data.program).toEqual(new Uint8Array([
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.JLT, 1, 0, 0
    ]));
});

test('JGTE', () => {
    const assembler = new Assembler();

    const data = assembler.run('JGTE $1');

    expect(data.program).toEqual(new Uint8Array([
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.JGTE, 1, 0, 0
    ]));
});

test('JLTE', () => {
    const assembler = new Assembler();

    const data = assembler.run('JLTE $1');

    expect(data.program).toEqual(new Uint8Array([
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.JLTE, 1, 0, 0
    ]));
});

test('Simple PROGRAM', () => {
    const assembler = new Assembler();

    const data = assembler.run(`
        LOAD $1  500
        LOAD $2  10
        LOAD $10 0
        LOAD $11 40
        LOAD $12 24
        SUB  $1  $2 $1
        CMP  $1  $10
        JEQ  $11
        JMP  $12
        HALT
    `);

    expect(data.program).toEqual(new Uint8Array([
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.LOAD, 1,  1,  244,  // 4
        Opcode.LOAD, 2,  0,  10,   // 8
        Opcode.LOAD, 10, 0,  0,    // 12
        Opcode.LOAD, 11, 0,  40,   // 16
        Opcode.LOAD, 12, 0,  24,   // 20
        Opcode.SUB,  1,  2,  1,    // 24
        Opcode.CMP,  1,  10, 0,    // 28
        Opcode.JEQ,  11, 0,  0,    // 32
        Opcode.JMP,  12, 0,  0,    // 36
        Opcode.HALT, 0,  0,  0     // 40
    ]));
});

test('Simple PROGRAM with labels', () => {
    const assembler = new Assembler();

    const data = assembler.run(`
        LABEL1: LOAD $1 500
        .X123ABC: LOAD $2 10
        JMP LABEL1
        JEQ .X123ABC
        JMP $1
        JEQ $2
        HALT
    `);

    expect(data.program).toEqual(new Uint8Array([
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.LOAD, 1,  1, 244,
        Opcode.LOAD, 2,  0, 10,
        Opcode.JMPL, 8,  0, 0,
        Opcode.JEQL, 12, 0, 0,
        Opcode.JMP,  1,  0, 0,
        Opcode.JEQ,  2,  0, 0,
        Opcode.HALT, 0,  0, 0
    ]));
});

test('provides no debug data by default', () => {
    const assembler = new Assembler();

    const data = assembler.run('HALT');

    expect(data.debugData).not.toBeDefined();
});

test('provides line number => pc map if debug data is requested', () => {
    const assembler = new Assembler();

    const data = assembler.run(`
        HALT
        
        
        HALT
        
        HALT
        
        HALT
    `, true);

    expect(data.debugData).toBeDefined();
    expect(data.debugData!.lineMap).toBeDefined();

    expect(data.debugData!.lineMap).toEqual([
        null,
        8,
        null,
        null,
        12,
        null,
        16,
        null,
        20,
        null
    ])
});

test('provides sorted list of registers used if debug data is requested', () => {
    const assembler = new Assembler();

    const data = assembler.run(`
        LOAD $1   500
        LOAD $2   10
        LOAD $10  0
        SUB  $1   $2 $1
        CMP  $3   $10
        JMP  $6
        JMPB $1
        JMPF $2
        CMP  $1   $5
    `, true);

    expect(data.debugData).toBeDefined();
    expect(data.debugData!.usedRegisters).toBeDefined();

    expect(data.debugData!.usedRegisters).toEqual([
        1, 2, 3, 5, 6, 10
    ]);
});

test('provides list of labels and pcs for them if debug data is requested', () => {
    const assembler = new Assembler();

    const data = assembler.run(`
        LOAD $1 50
        LOAD $2 10
        LOAD $10 0
        LOAD $11 0
        LOAD $12 1
        
        
START:  SUB  $1 $2 $1
        ADD  $11 $12 $11
        CMP  $1 $10
        
        JEQ  END
        JMP  START
        
        
END:    HALT
    `, true);

    expect(data.debugData).toBeDefined();
    expect(data.debugData!.labels).toBeDefined();

    expect(data.debugData!.labels).toEqual({
        'END': 48,
        'START': 28
    });
});

test('handles .asciiz', () => {
    const assembler = new Assembler();

    const data = assembler.run(`
        .asciiz 'foo'
        LOAD $1 500
    `);

    expect(data.program).toEqual(new Uint8Array([
        ... ID_HEADER,
        12, 0, 0, 0, // index of body
        102, 111, 111, 0, // 'f' 'o' 'o' 0
        Opcode.LOAD, 1, 1, 244,
    ]));
});

test('handles multiple (empty, single char, long) .asciiz', () => {
    const assembler = new Assembler();

    const data = assembler.run(`
        .asciiz 'foo bar baz lorem impsum whatever'
        .asciiz 'x'
        LOAD $1 50
        .asciiz ''
        LOAD $1 500
        .asciiz 'qqq'
    `);

    expect(data.program).toEqual(new Uint8Array([
        ... ID_HEADER,
        52, 0, 0, 0,
        102, 111, 111, 32, 98, 97, 114, 32, 98, 97, 122, 32, 108, 111, 114, 101, 109, 32, 105, 109, 112, 115, 117, 109, 32, 119, 104, 97, 116, 101, 118, 101, 114, 0,
        120, 0,
        0,
        113, 113, 113, 0,
        0, 0, 0,
        Opcode.LOAD, 1, 0, 50,
        Opcode.LOAD, 1, 1, 244,
    ]));
});

test('handles labeled .asciiz', () => {
    const assembler = new Assembler();

    const data = assembler.run(`
        L1: .asciiz 'foo bar baz lorem impsum whatever'
        L2: .asciiz 'x'
        L3: LOAD $1 50
        L4: .asciiz ''
        L5: LOAD $1 500
        L6: .asciiz 'qqq'
    `, true);

    expect(data.debugData).toBeDefined();
    expect(data.debugData!.labels).toBeDefined();

    expect(data.debugData!.labels).toEqual({
        'L1': 8,
        'L2': 42,
        'L3': 52,
        'L4': 44,
        'L5': 56,
        'L6': 45
    });
});

test('PROGRAM #1', () => {
    const assembler = new Assembler();

    const data = assembler.run(`
        LOAD $1 50
        LOAD $2 10
        LOAD $10 0
        LOAD $11 0
        LOAD $12 1
        
        
START:  SUB  $1 $2 $1
        ADD  $11 $12 $11
        CMP  $1 $10
        
        JEQ  END
        JMP  START
        
        
END:    HALT`);

    expect(data.program).toEqual(new Uint8Array([
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.LOAD, 1,  0,  50,
        Opcode.LOAD, 2,  0,  10,
        Opcode.LOAD, 10, 0,  0,
        Opcode.LOAD, 11, 0,  0,
        Opcode.LOAD, 12, 0,  1,
        Opcode.SUB,  1,  2,  1,
        Opcode.ADD,  11, 12, 11,
        Opcode.CMP,  1,  10, 0,
        Opcode.JEQL, 48, 0,  0,
        Opcode.JMPL, 28, 0,  0,
        Opcode.HALT, 0,  0, 0
    ]));
});

test('PROGRAM #2', () => {
    const assembler = new Assembler();

    const data = assembler.run(`
.asciiz 'foo'
BAR: .asciiz 'bar'

        LOAD $1 50
        LOAD $2 10
        LOAD $10 0
        LOAD $11 0
        LOAD $12 1
        
        
START:  SUB  $1 $2 $1
        ADD  $11 $12 $11
        CMP  $1 $10
        
        JEQ  END
        JMP  START
        
        
END:    HALT`);

    expect(data.program).toEqual(new Uint8Array([
        ... ID_HEADER,
        16, 0, 0, 0,
        102, 111, 111, 0,
        98, 97, 114 , 0,
        Opcode.LOAD, 1,  0,  50,
        Opcode.LOAD, 2,  0,  10,
        Opcode.LOAD, 10, 0,  0,
        Opcode.LOAD, 11, 0,  0,
        Opcode.LOAD, 12, 0,  1,
        Opcode.SUB,  1,  2,  1,
        Opcode.ADD,  11, 12, 11,
        Opcode.CMP,  1,  10, 0,
        Opcode.JEQL, 56, 0,  0,
        Opcode.JMPL, 36, 0,  0,
        Opcode.HALT, 0,  0, 0
    ]));
});

test('PUTS LABEL', () => {
    const assembler = new Assembler();

    const data = assembler.run('LABEL: PUTS LABEL');

    expect(data.program).toEqual(new Uint8Array([
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.PUTS, 8, 0, 0
    ]));
});

test('LOAD $1 [500]', () => {
    const assembler = new Assembler();

    const data = assembler.run('LOAD $1 [500]');

    expect(data.program).toEqual(new Uint8Array([
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.LOADA, 1, 1, 244
    ]));
});

test('LOAD $1 [$2]', () => {
    const assembler = new Assembler();

    const data = assembler.run('LOAD $1 [$2]');

    expect(data.program).toEqual(new Uint8Array([
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.LOADAR, 1, 2, 0
    ]));
});

test('SAVE [0] 10', () => {
    const assembler = new Assembler();

    const data = assembler.run('SAVE [0] 10');

    expect(data.program).toEqual(new Uint8Array([
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.SAVE, 0, 0, 10
    ]));
});

test('SAVE [65535] 10', () => {
    const assembler = new Assembler();

    const data = assembler.run('SAVE [65535] 10');

    expect(data.program).toEqual(new Uint8Array([
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.SAVE, 255, 255, 10
    ]));
});

test('SAVE [65535] 500, with int overflow', () => {
    const assembler = new Assembler();

    const data = assembler.run('SAVE [65535] 500');

    expect(data.program).toEqual(new Uint8Array([
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.SAVE, 255, 255, 244
    ]));
});

test('SAVE [$1] 10', () => {
    const assembler = new Assembler();

    const data = assembler.run('SAVE [$1] 10');

    expect(data.program).toEqual(new Uint8Array([
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.SAVETOR, 1, 10, 0
    ]));
});

test('SAVE [500] $2', () => {
    const assembler = new Assembler();

    const data = assembler.run('SAVE [500] $2');

    expect(data.program).toEqual(new Uint8Array([
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.SAVER, 1, 244, 2
    ]));
});

test('SAVE [$1] $2', () => {
    const assembler = new Assembler();

    const data = assembler.run('SAVE [$1] $2');

    expect(data.program).toEqual(new Uint8Array([
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.SAVERTOR, 1, 2, 0
    ]));
});