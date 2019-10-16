import { Assembler } from './Assembler';
import { Opcode } from '../Instruction';


test('HALT', () => {
    const assembler = new Assembler();

    const data = assembler.run('HALT');

    expect(data.program).toEqual(new Uint8Array([
        Opcode.HALT, 0, 0, 0
    ]));
});

test('LOAD', () => {
    const assembler = new Assembler();

    const data = assembler.run('LOAD $15 500');

    expect(data.program).toEqual(new Uint8Array([
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
        Opcode.HALT, 0, 0, 0,
        Opcode.LOAD, 15, 1, 244
    ]));
});

test('ADD', () => {
    const assembler = new Assembler();

    const data = assembler.run('ADD $1 $2 $3');

    expect(data.program).toEqual(new Uint8Array([
        Opcode.ADD, 1, 2, 3
    ]));
});

test('SUB', () => {
    const assembler = new Assembler();

    const data = assembler.run('SUB $1 $2 $3');

    expect(data.program).toEqual(new Uint8Array([
        Opcode.SUB, 1, 2, 3
    ]));
});

test('MUL', () => {
    const assembler = new Assembler();

    const data = assembler.run('MUL $1 $2 $3');

    expect(data.program).toEqual(new Uint8Array([
        Opcode.MUL, 1, 2, 3
    ]));
});

test('DIV', () => {
    const assembler = new Assembler();

    const data = assembler.run('DIV $1 $2 $3');

    expect(data.program).toEqual(new Uint8Array([
        Opcode.DIV, 1, 2, 3
    ]));
});

test('JMP', () => {
    const assembler = new Assembler();

    const data = assembler.run('JMP $1');

    expect(data.program).toEqual(new Uint8Array([
        Opcode.JMP, 1, 0, 0
    ]));
});

test('JMPF', () => {
    const assembler = new Assembler();

    const data = assembler.run('JMPF $1');

    expect(data.program).toEqual(new Uint8Array([
        Opcode.JMPF, 1, 0, 0
    ]));
});

test('JMPB', () => {
    const assembler = new Assembler();

    const data = assembler.run('JMPB $1');

    expect(data.program).toEqual(new Uint8Array([
        Opcode.JMPB, 1, 0, 0
    ]));
});

test('CMP', () => {
    const assembler = new Assembler();

    const data = assembler.run('CMP $1 $2');

    expect(data.program).toEqual(new Uint8Array([
        Opcode.CMP, 1, 2, 0
    ]));
});

test('JEQ', () => {
    const assembler = new Assembler();

    const data = assembler.run('JEQ $1');

    expect(data.program).toEqual(new Uint8Array([
        Opcode.JEQ, 1, 0, 0
    ]));
});

test('JNEQ', () => {
    const assembler = new Assembler();

    const data = assembler.run('JNEQ $1');

    expect(data.program).toEqual(new Uint8Array([
        Opcode.JNEQ, 1, 0, 0
    ]));
});

test('JGT', () => {
    const assembler = new Assembler();

    const data = assembler.run('JGT $1');

    expect(data.program).toEqual(new Uint8Array([
        Opcode.JGT, 1, 0, 0
    ]));
});

test('JLT', () => {
    const assembler = new Assembler();

    const data = assembler.run('JLT $1');

    expect(data.program).toEqual(new Uint8Array([
        Opcode.JLT, 1, 0, 0
    ]));
});

test('JGTE', () => {
    const assembler = new Assembler();

    const data = assembler.run('JGTE $1');

    expect(data.program).toEqual(new Uint8Array([
        Opcode.JGTE, 1, 0, 0
    ]));
});

test('JLTE', () => {
    const assembler = new Assembler();

    const data = assembler.run('JLTE $1');

    expect(data.program).toEqual(new Uint8Array([
        Opcode.JLTE, 1, 0, 0
    ]));
});

test('Simple PROGRAM', () => {
    const assembler = new Assembler();

    const data = assembler.run(`
        LOAD $1  500
        LOAD $2  10
        LOAD $10 0
        LOAD $11 36
        LOAD $12 20
        SUB  $1  $2 $1
        CMP  $1  $10
        JEQ  $11
        JMP  $12
        HALT
    `);

    expect(data.program).toEqual(new Uint8Array([
        Opcode.LOAD, 1,  1,  244,  // 0
        Opcode.LOAD, 2,  0,  10,   // 4
        Opcode.LOAD, 10, 0,  0,    // 8
        Opcode.LOAD, 11, 0,  36,   // 12
        Opcode.LOAD, 12, 0,  20,   // 16
        Opcode.SUB,  1,  2,  1,    // 20
        Opcode.CMP,  1,  10, 0,    // 24
        Opcode.JEQ,  11, 0,  0,    // 28
        Opcode.JMP,  12, 0,  0,    // 32
        Opcode.HALT, 0,  0,  0     // 36
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
        Opcode.LOAD, 1, 1, 244,
        Opcode.LOAD, 2, 0, 10,
        Opcode.JMPL, 0, 0, 0,
        Opcode.JEQL, 4, 0, 0,
        Opcode.JMP,  1, 0, 0,
        Opcode.JEQ,  2, 0, 0,
        Opcode.HALT, 0, 0, 0
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
        0,
        null,
        null,
        4,
        null,
        8,
        null,
        12,
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
    ])
});