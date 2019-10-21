import { Assembler } from './Assembler';
import { ID_HEADER, Opcode } from '../Instruction';


test('HALT', () => {
    const assembler = new Assembler();

    const data = assembler.run('HALT');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.HALT, 0, 0, 0
    ]));
});

test('LOAD $15 500', () => {
    const assembler = new Assembler();

    const data = assembler.run('LOAD $15 500');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.LOAD, 15, 1, 244
    ]));
});

test('header', () => {
    const assembler = new Assembler();

    const data = assembler.run('LOAD $15 500');

    expect(data.program.slice(0, 68)).toEqual(new Uint8Array([
        ... ID_HEADER,
        255, 253, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        64, 0, 0, 0,
        Opcode.LOAD, 15, 1, 244
    ]));
});

test('LOAD $15 100 + 400', () => {
    const assembler = new Assembler();

    const data = assembler.run('LOAD $15 100 + 400');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.LOAD, 15, 1, 244
    ]));
});

test('HALT + LOAD', () => {
    const assembler = new Assembler();

    const data = assembler.run(`
        HALT
        LOAD $15 500
    `);

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.HALT, 0, 0, 0,
        Opcode.LOAD, 15, 1, 244
    ]));
});

test('ADD', () => {
    const assembler = new Assembler();

    const data = assembler.run('ADD $1 $2 $3');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.ADD, 1, 2, 3
    ]));
});

test('SUB', () => {
    const assembler = new Assembler();

    const data = assembler.run('SUB $1 $2 $3');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.SUB, 1, 2, 3
    ]));
});

test('MUL', () => {
    const assembler = new Assembler();

    const data = assembler.run('MUL $1 $2 $3');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.MUL, 1, 2, 3
    ]));
});

test('DIV', () => {
    const assembler = new Assembler();

    const data = assembler.run('DIV $1 $2 $3');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.DIV, 1, 2, 3
    ]));
});

test('JMP', () => {
    const assembler = new Assembler();

    const data = assembler.run('JMP $1');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.JMP, 1, 0, 0
    ]));
});

test('JMPF', () => {
    const assembler = new Assembler();

    const data = assembler.run('JMPF $1');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.JMPF, 1, 0, 0
    ]));
});

test('JMPB', () => {
    const assembler = new Assembler();

    const data = assembler.run('JMPB $1');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.JMPB, 1, 0, 0
    ]));
});

test('CMP', () => {
    const assembler = new Assembler();

    const data = assembler.run('CMP $1 $2');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.CMP, 1, 2, 0
    ]));
});

test('CMPN', () => {
    const assembler = new Assembler();

    const data = assembler.run('CMPN $1 $2');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.CMPN, 1, 2, 0
    ]));
});

test('CMPI', () => {
    const assembler = new Assembler();

    const data = assembler.run('CMP $1 100');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.CMPI, 1, 0, 100
    ]));
});

test('CMPNI', () => {
    const assembler = new Assembler();

    const data = assembler.run('CMPN $1 -100');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.CMPNI, 1, 255, 156
    ]));
});

test('JEQ', () => {
    const assembler = new Assembler();

    const data = assembler.run('JEQ $1');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.JEQ, 1, 0, 0
    ]));
});

test('JNEQ', () => {
    const assembler = new Assembler();

    const data = assembler.run('JNEQ $1');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.JNEQ, 1, 0, 0
    ]));
});

test('JGT', () => {
    const assembler = new Assembler();

    const data = assembler.run('JGT $1');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.JGT, 1, 0, 0
    ]));
});

test('JLT', () => {
    const assembler = new Assembler();

    const data = assembler.run('JLT $1');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.JLT, 1, 0, 0
    ]));
});

test('JGTE', () => {
    const assembler = new Assembler();

    const data = assembler.run('JGTE $1');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.JGTE, 1, 0, 0
    ]));
});

test('JLTE', () => {
    const assembler = new Assembler();

    const data = assembler.run('JLTE $1');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
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

    expect(data.program.slice(64)).toEqual(new Uint8Array([
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

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.LOAD, 1,  1, 244,
        Opcode.LOAD, 2,  0, 10,
        Opcode.JMPL, 64,  0, 0,
        Opcode.JEQL, 68, 0, 0,
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
        64,
        null,
        null,
        68,
        null,
        72,
        null,
        76,
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

test('provides list of labels and PCs for them if debug data is requested', () => {
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
        'END': 104,
        'START': 84
    });
});

test('handles .asciiz', () => {
    const assembler = new Assembler();

    const data = assembler.run(`
        .asciiz 'foo'
        LOAD $1 500
    `);

    expect(data.program.slice(60)).toEqual(new Uint8Array([
        68, 0, 0, 0, // index of body
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

    expect(data.program.slice(60)).toEqual(new Uint8Array([
        108, 0, 0, 0,
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
        'L3': 108,
        'L4': 44,
        'L5': 112,
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

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.LOAD, 1,  0,  50,
        Opcode.LOAD, 2,  0,  10,
        Opcode.LOAD, 10, 0,  0,
        Opcode.LOAD, 11, 0,  0,
        Opcode.LOAD, 12, 0,  1,
        Opcode.SUB,  1,  2,  1,
        Opcode.ADD,  11, 12, 11,
        Opcode.CMP,  1,  10, 0,
        Opcode.JEQL, 104, 0,  0,
        Opcode.JMPL, 84, 0,  0,
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

    expect(data.program.slice(60)).toEqual(new Uint8Array([
        72, 0, 0, 0,
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
        Opcode.JEQL, 112, 0,  0,
        Opcode.JMPL, 92, 0,  0,
        Opcode.HALT, 0,  0, 0
    ]));
});

test('PUTS LABEL', () => {
    const assembler = new Assembler();

    const data = assembler.run('LABEL: PUTS LABEL');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.PUTS, 64, 0, 0
    ]));
});

test('LOAD $1 [500]', () => {
    const assembler = new Assembler();

    const data = assembler.run('LOAD $1 [500]');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.LOADA, 1, 1, 244
    ]));
});

test('LOAD $1 [255, 127]', () => {
    const assembler = new Assembler();

    const data = assembler.run('LOAD $1 [255, 127]');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.LOADA, 1, 1, 126
    ]));
});

test('LOAD $1 [$2]', () => {
    const assembler = new Assembler();

    const data = assembler.run('LOAD $1 [$2]');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.LOADAR, 1, 2, 0
    ]));
});

test('LOAD $1 [$2, 127]', () => {
    const assembler = new Assembler();

    const data = assembler.run('LOAD $1 [$2, 127]');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.LOADAR, 1, 2, 127
    ]));
});

test('SAVE [0] 10', () => {
    const assembler = new Assembler();

    const data = assembler.run('SAVE [0] 10');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.SAVE, 0, 0, 10
    ]));
});

test('SAVE [65535] 10', () => {
    const assembler = new Assembler();

    const data = assembler.run('SAVE [65535] 10');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.SAVE, 255, 255, 10
    ]));
});

test('SAVE [65535] -10', () => {
    const assembler = new Assembler();

    const data = assembler.run('SAVE [65535] -10');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.SAVE, 255, 255, 246
    ]));
});

test('SAVE [255, 127] 10', () => {
    const assembler = new Assembler();

    const data = assembler.run('SAVE [255, 127] 10');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.SAVE, 1, 126, 10
    ]));
});

test('SAVE [65535] 127', () => {
    const assembler = new Assembler();

    const data = assembler.run('SAVE [65535] 127');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.SAVE, 255, 255, 127
    ]));
});

test('SAVE [65535] -128', () => {
    const assembler = new Assembler();

    const data = assembler.run('SAVE [65535] -128');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.SAVE, 255, 255, -128
    ]));
});

test('SAVE [$1] 10', () => {
    const assembler = new Assembler();

    const data = assembler.run('SAVE [$1] 10');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.SAVETOR, 1, 0, 10
    ]));
});

test('SAVE [$1, 127] 10', () => {
    const assembler = new Assembler();

    const data = assembler.run('SAVE [$1, 127] 10');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.SAVETOR, 1, 127, 10
    ]));
});

test('SAVE [$1, -128] 10', () => {
    const assembler = new Assembler();

    const data = assembler.run('SAVE [$1, -128] 10');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.SAVETOR, 1, -128, 10
    ]));
});
test('SAVE [500] $2', () => {
    const assembler = new Assembler();

    const data = assembler.run('SAVE [500] $2');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.SAVER, 1, 244, 2
    ]));
});

test('SAVE [255, 127] $2', () => {
    const assembler = new Assembler();

    const data = assembler.run('SAVE [255, 127] $2');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.SAVER, 1, 126, 2
    ]));
});

test('SAVE [$1] $2', () => {
    const assembler = new Assembler();

    const data = assembler.run('SAVE [$1] $2');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.SAVERTOR, 1, 0, 2
    ]));
});

test('SAVE [$1, 127] $2', () => {
    const assembler = new Assembler();

    const data = assembler.run('SAVE [$1, 127] $2');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.SAVERTOR, 1, 127, 2
    ]));
});

test('PUSH $1', () => {
    const assembler = new Assembler();

    const data = assembler.run('PUSH $1');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.PUSH, 1, 0, 0
    ]));
});

test('POP $1', () => {
    const assembler = new Assembler();

    const data = assembler.run('POP $1');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.POP, 1, 0, 0
    ]));
});

test('PUSH { $0 }', () => {
    const assembler = new Assembler();

    const data = assembler.run('PUSH { $0 }');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.PUSHM, 0, 0, 1
    ]));
});

test('PUSH { $1 }', () => {
    const assembler = new Assembler();

    const data = assembler.run('PUSH { $1 }');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.PUSHM, 0, 0, 17
    ]));
});

test('PUSH { $2 }', () => {
    const assembler = new Assembler();

    const data = assembler.run('PUSH { $2 }');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.PUSHM, 0, 0, 33
    ]));
});

test('PUSH { $15 }', () => {
    const assembler = new Assembler();

    const data = assembler.run('PUSH { $15 }');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.PUSHM, 0, 0, 241
    ]));
});

test('PUSH { $0 $1 }', () => {
    const assembler = new Assembler();

    const data = assembler.run('PUSH { $0 $1 }');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.PUSHM, 0, 0, 18
    ]));
});

test('PUSH { $1 $0 }', () => {
    const assembler = new Assembler();

    const data = assembler.run('PUSH { $1 $0 }');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.PUSHM, 0, 1, 2
    ]));
});

test('PUSH { $1 $3 }', () => {
    const assembler = new Assembler();

    const data = assembler.run('PUSH { $1 $3 }');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.PUSHM, 0, 1, 50
    ]));
});

test('PUSH { $11 $6 }', () => {
    const assembler = new Assembler();

    const data = assembler.run('PUSH { $11 $6 }');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.PUSHM, 0, 11, 98
    ]));
});

test('PUSH { $0 $1 $2 }', () => {
    const assembler = new Assembler();

    const data = assembler.run('PUSH { $0 $1 $2 }');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.PUSHM, 0, 1, 35
    ]));
});

test('PUSH { $3 $2 $1 }', () => {
    const assembler = new Assembler();

    const data = assembler.run('PUSH { $3 $2 $1 }');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.PUSHM, 0, 50, 19
    ]));
});

test('PUSH { $1 $3 $5 $6 }', () => {
    const assembler = new Assembler();

    const data = assembler.run('PUSH { $1 $3 $5 $6 }');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.PUSHM, 1, 53, 100
    ]));
});

test('PUSH { $11 $10 $9 $8 $7 }', () => {
    const assembler = new Assembler();

    const data = assembler.run('PUSH { $11 $10 $9 $8 $7 }');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.PUSHM, 186, 152, 117
    ]));
});

test('POP { $0 }', () => {
    const assembler = new Assembler();

    const data = assembler.run('POP { $0 }');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.POPM, 0, 0, 1
    ]));
});

test('CALL LABEL', () => {
    const assembler = new Assembler();

    const data = assembler.run('LABEL: CALL LABEL');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.CALL, 64, 0, 0
    ]));
});


test('RET', () => {
    const assembler = new Assembler();

    const data = assembler.run('RET');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.RET, 0, 0, 0
    ]));
});

test('ADD $1 127 $2', () => {
    const assembler = new Assembler();

    const data = assembler.run('ADD $1 127 $2');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.ADDI, 1, 127, 2
    ]));
});

test('SUB $1 127 $2', () => {
    const assembler = new Assembler();

    const data = assembler.run('SUB $1 127 $2');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.SUBI, 1, 127, 2
    ]));
});

test('MUL $1 127 $2', () => {
    const assembler = new Assembler();

    const data = assembler.run('MUL $1 127 $2');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.MULI, 1, 127, 2
    ]));
});

test('DIV $1 127 $2', () => {
    const assembler = new Assembler();

    const data = assembler.run('DIV $1 127 $2');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.DIVI, 1, 127, 2
    ]));
});

test('INC $1', () => {
    const assembler = new Assembler();

    const data = assembler.run('INC $1');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.INC, 1, 0, 0
    ]));
});

test('DEC $1', () => {
    const assembler = new Assembler();

    const data = assembler.run('DEC $1');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.DEC, 1, 0, 0
    ]));
});

test('MOV $1 $2', () => {
    const assembler = new Assembler();

    const data = assembler.run('MOV $1 $2');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.MOV, 1, 2, 0
    ]));
});

test('AND $1 $2', () => {
    const assembler = new Assembler();

    const data = assembler.run('AND $1 $2');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.AND, 1, 2, 0
    ]));
});

test('OR $1 $2', () => {
    const assembler = new Assembler();

    const data = assembler.run('OR $1 $2');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.OR, 1, 2, 0
    ]));
});

test('XOR $1 $2', () => {
    const assembler = new Assembler();

    const data = assembler.run('XOR $1 $2');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.XOR, 1, 2, 0
    ]));
});

test('NOT $1', () => {
    const assembler = new Assembler();

    const data = assembler.run('NOT $1');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.NOT, 1, 0, 0
    ]));
});

test('BIC $1 $2', () => {
    const assembler = new Assembler();

    const data = assembler.run('BIC $1 $2');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.BIC, 1, 2, 0
    ]));
});

test('SHL $1 $2 $3', () => {
    const assembler = new Assembler();

    const data = assembler.run('SHL $1 $2 $3');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.SHL, 1, 2, 3
    ]));
});

test('SHL $1 $2 1', () => {
    const assembler = new Assembler();

    const data = assembler.run('SHL $1 $2 1');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.SHLI, 1, 2, 1
    ]));
});

test('SHR $1 $2 $3', () => {
    const assembler = new Assembler();

    const data = assembler.run('SHR $1 $2 $3');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.SHR, 1, 2, 3
    ]));
});

test('SHR $1 $2 1', () => {
    const assembler = new Assembler();

    const data = assembler.run('SHR $1 $2 1');

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.SHRI, 1, 2, 1
    ]));
});

test('stack size is part of program header', () => {
    const assembler = new Assembler();

    const data = assembler.run('SHR $1 $2 1');

    expect(data.program.slice(0, 8)).toEqual(new Uint8Array([
        ... ID_HEADER,
        255, 253, 0, 0
    ]));

    expect(data.program.slice(64)).toEqual(new Uint8Array([
        Opcode.SHRI, 1, 2, 1
    ]));
});

test('stack size can be adjusted', () => {
    const assembler = new Assembler();

    const data = assembler.run(`
        .stack 10
        SHR $1 $2 1
    `);

    expect(data.program.slice(0, 8)).toEqual(new Uint8Array([
        ... ID_HEADER,
        0, 10, 0, 0
    ]));
});

