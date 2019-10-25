import { VM } from './VM';
import { VMError } from './VMError';
import { ID_HEADER, Opcode } from '../Instruction';
import { MemoryError } from './MemoryError';
import { StackError } from './StackError';


const HEADER_SECTION_NO_BODY_OFFSET = [
    ... ID_HEADER,
    255, 255, 0, 0,
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
];

const HEADER_SECTION = [
    ... HEADER_SECTION_NO_BODY_OFFSET,
    64, 0, 0, 0,
];

test('a VM is initialized', () => {
    const vm = new VM();
    expect(vm.registers[0]).toBe(0);
});

test('HALT', () => {
    const vm = new VM();
    vm.program = Uint8Array.from([Opcode.HALT, 0, 0, 0]);
    vm.exec();
    expect(vm.registers[15]).toBe(4);
});

test('ILGL', () => {
    expect(() => {
        const vm = new VM();
        vm.program = Uint8Array.from([200, 0, 0, 0]);
        vm.exec();
        expect(vm.registers[15]).toBe(1);
    }).toThrowError(new VMError(`Unrecognized opcode [200] found! PC: 1 Terminating!`));
});

test('LOAD', () => {
    const vm = new VM();
    vm.program = Uint8Array.from([Opcode.LOAD, 0, 1, 244]);
    vm.exec();
    expect(vm.registers[0]).toBe(500);
});

test('ADD', () => {
    const vm = new VM();
    vm.registers[0] = 500;
    vm.registers[1] = 10;
    vm.program = Uint8Array.from([Opcode.ADD, 2, 0, 1]);
    vm.exec();
    expect(vm.registers[2]).toBe(510);
});

test('ADD with negative numbers 1', () => {
    const vm = new VM();
    vm.registers[0] = 500;
    vm.registers[1] = -10;
    vm.program = Uint8Array.from([Opcode.ADD, 2, 0, 1]);
    vm.exec();
    expect(vm.registers[2]).toBe(490);
});

test('ADD with negative numbers 2', () => {
    const vm = new VM();
    vm.registers[0] = -500;
    vm.registers[1] = -10;
    vm.program = Uint8Array.from([Opcode.ADD, 2, 0, 1]);
    vm.exec();
    expect(vm.registers[2]).toBe(-510);
});

test('ADD with immediate', () => {
    const vm = new VM();
    vm.registers[0] = 500;
    vm.program = Uint8Array.from([Opcode.ADDI, 2, 0, 10]);
    vm.exec();
    expect(vm.registers[2]).toBe(510);
});

test('ADD with negative immediate', () => {
    const vm = new VM();
    vm.registers[0] = 500;
    vm.program = Uint8Array.from([Opcode.ADDI, 2, 0, -10]);
    vm.exec();
    expect(vm.registers[2]).toBe(490);
});

test('INC', () => {
    const vm = new VM();
    vm.registers[0] = 500;
    vm.program = Uint8Array.from([Opcode.INC, 0, 0, 0]);
    vm.exec();
    expect(vm.registers[0]).toBe(501);
});

test('SUB', () => {
    const vm = new VM();
    vm.registers[0] = 500;
    vm.registers[1] = 10;
    vm.program = Uint8Array.from([Opcode.SUB, 2, 0, 1]);
    vm.exec();
    expect(vm.registers[2]).toBe(490);
});

test('SUB with immediate', () => {
    const vm = new VM();
    vm.registers[0] = 500;
    vm.program = Uint8Array.from([Opcode.SUBI, 2, 0, 10]);
    vm.exec();
    expect(vm.registers[2]).toBe(490);
});

test('SUB with negative immediate', () => {
    const vm = new VM();
    vm.registers[0] = 500;
    vm.program = Uint8Array.from([Opcode.SUBI, 2, 0, -10]);
    vm.exec();
    expect(vm.registers[2]).toBe(510);
});

test('SUB with negative numbers 1', () => {
    const vm = new VM();
    vm.registers[0] = 500;
    vm.registers[1] = -10;
    vm.program = Uint8Array.from([Opcode.SUB, 2, 0, 1]);
    vm.exec();
    expect(vm.registers[2]).toBe(510);
});

test('SUB with negative numbers 2', () => {
    const vm = new VM();
    vm.registers[0] = -500;
    vm.registers[1] = 10;
    vm.program = Uint8Array.from([Opcode.SUB, 2, 0, 1]);
    vm.exec();
    expect(vm.registers[2]).toBe(-510);
});

test('DEC', () => {
    const vm = new VM();
    vm.registers[0] = 500;
    vm.program = Uint8Array.from([Opcode.DEC, 0, 0, 0]);
    vm.exec();
    expect(vm.registers[0]).toBe(499);
});

test('MUL', () => {
    const vm = new VM();
    vm.registers[0] = 500;
    vm.registers[1] = 10;
    vm.program = Uint8Array.from([Opcode.MUL, 2, 0, 1]);
    vm.exec();
    expect(vm.registers[2]).toBe(5000);
});

test('MUL with immediate', () => {
    const vm = new VM();
    vm.registers[0] = 500;
    vm.program = Uint8Array.from([Opcode.MULI, 2, 0, 10]);
    vm.exec();
    expect(vm.registers[2]).toBe(5000);
});

test('MUL with negative immediate', () => {
    const vm = new VM();
    vm.registers[0] = 500;
    vm.program = Uint8Array.from([Opcode.MULI, 2, 0, -10]);
    vm.exec();
    expect(vm.registers[2]).toBe(-5000);
});


test('MUL with negative numbers 1', () => {
    const vm = new VM();
    vm.registers[0] = 500;
    vm.registers[1] = -10;
    vm.program = Uint8Array.from([Opcode.MUL, 2, 0, 1]);
    vm.exec();
    expect(vm.registers[2]).toBe(-5000);
});

test('MUL with negative numbers 2', () => {
    const vm = new VM();
    vm.registers[0] = -500;
    vm.registers[1] = -10;
    vm.program = Uint8Array.from([Opcode.MUL, 2, 0, 1]);
    vm.exec();
    expect(vm.registers[2]).toBe(5000);
});

test('DIV (no remainder)', () => {
    const vm = new VM();
    vm.registers[0] = 500;
    vm.registers[1] = 10;
    vm.program = Uint8Array.from([Opcode.DIV, 2, 0, 1]);
    vm.exec();
    expect(vm.registers[2]).toBe(50);
});

test('DIV with immediate', () => {
    const vm = new VM();
    vm.registers[0] = 505;
    vm.program = Uint8Array.from([Opcode.DIVI, 2, 0, 10]);
    vm.exec();
    expect(vm.registers[2]).toBe(50);
    expect(vm.flags.remainder).toBe(5);
});

test('DIV with negative immediate', () => {
    const vm = new VM();
    vm.registers[0] = 505;
    vm.program = Uint8Array.from([Opcode.DIVI, 2, 0, -10]);
    vm.exec();
    expect(vm.registers[2]).toBe(-50);
    expect(vm.flags.remainder).toBe(5);
});

test('DIV with remainder', () => {
    const vm = new VM();
    vm.registers[0] = 500;
    vm.registers[1] = 9;
    vm.program = Uint8Array.from([Opcode.DIV, 2, 0, 1]);
    vm.exec();
    expect(vm.registers[2]).toBe(55);
    expect(vm.flags.remainder).toBe(5);
});

test('DIV with negative numbers 1', () => {
    const vm = new VM();
    vm.registers[0] = 500;
    vm.registers[1] = -10;
    vm.program = Uint8Array.from([Opcode.DIV, 2, 0, 1]);
    vm.exec();
    expect(vm.registers[2]).toBe(-50);
});

test('DIV with negative numbers 2', () => {
    const vm = new VM();
    vm.registers[0] = -500;
    vm.registers[1] = -10;
    vm.program = Uint8Array.from([Opcode.DIV, 2, 0, 1]);
    vm.exec();
    expect(vm.registers[2]).toBe(50);
});

test('DIV with negative number and remainder', () => {
    const vm = new VM();
    vm.registers[0] = 500;
    vm.registers[1] = -9;
    vm.program = Uint8Array.from([Opcode.DIV, 2, 0, 1]);
    vm.exec();
    expect(vm.registers[2]).toBe(-55);
    expect(vm.flags.remainder).toBe(5);
});

test('JMP', () => {
    const vm = new VM();
    vm.registers[5] = 9;
    vm.program = Uint8Array.from([Opcode.JMP, 5, 0, 0]);
    vm.exec();
    expect(vm.registers[15]).toBe(9);
});

test('JMPF', () => {
    const vm = new VM();
    vm.registers[2] = 4;
    vm.program = Uint8Array.from([Opcode.JMPF, 2, 0, 0]);
    vm.exec();
    expect(vm.registers[15]).toBe(8);
});

test('JMPB', () => {
    const vm = new VM();
    vm.registers[2] = 4;
    vm.program = Uint8Array.from([Opcode.JMPB, 2, 0, 0]);
    vm.exec();
    expect(vm.registers[15]).toBe(0);
});

test('CMP equal flag', () => {
    const vm = new VM();
    vm.registers[0] = 2;
    vm.registers[1] = 2;

    vm.program = Uint8Array.from([Opcode.CMP, 0, 1, 0]);
    vm.exec();
    expect(vm.flags.equal).toBe(true);

    vm.registers[1] = 3;

    vm.exec();
    expect(vm.flags.equal).toBe(false);
});

test('CMP immediate', () => {
    const vm = new VM();
    vm.registers[0] = 2;

    vm.program = Uint8Array.from([Opcode.CMPI, 0, 0, 2]);
    vm.exec();
    expect(vm.flags.equal).toBe(true);

    vm.registers[0] = 3;

    vm.exec();
    expect(vm.flags.equal).toBe(false);
});

test('CMP negative numbers', () => {
    const vm = new VM();
    vm.registers[0] = -2;
    vm.registers[1] = 2;

    vm.program = Uint8Array.from([Opcode.CMP, 0, 1, 0]);
    vm.exec();
    expect(vm.flags.equal).toBe(false);

    vm.registers[1] = -2;

    vm.exec();
    expect(vm.flags.equal).toBe(true);
});

test('CMP negative flag', () => {
    const vm = new VM();
    vm.registers[0] = 3;
    vm.registers[1] = 2;

    vm.program = Uint8Array.from([Opcode.CMP, 0, 1, 0]);
    vm.exec();
    expect(vm.flags.negative).toBe(false);
    expect(vm.flags.equal).toBe(false);

    vm.registers[1] = 4;

    vm.exec();
    expect(vm.flags.negative).toBe(true);
    expect(vm.flags.equal).toBe(false);

    vm.registers[1] = 3;

    vm.exec();
    expect(vm.flags.negative).toBe(false);
    expect(vm.flags.equal).toBe(true);
});

test('CMPN equal flag', () => {
    const vm = new VM();
    vm.registers[0] = 2;
    vm.registers[1] = -2;

    vm.program = Uint8Array.from([Opcode.CMPN, 0, 1, 0]);
    vm.exec();
    expect(vm.flags.equal).toBe(true);

    vm.registers[1] = 3;

    vm.exec();
    expect(vm.flags.equal).toBe(false);
});

test('CMPN immediate', () => {
    const vm = new VM();

    vm.registers[0] = 100;

    vm.program = Uint8Array.from([Opcode.CMPNI, 0, 255, 156]);
    vm.exec();
    expect(vm.flags.equal).toBe(true);

    vm.registers[0] = -100;

    vm.exec();
    expect(vm.flags.equal).toBe(false);
});

test('CMPN negative numbers', () => {
    const vm = new VM();
    vm.registers[0] = -2;
    vm.registers[1] = -2;

    vm.program = Uint8Array.from([Opcode.CMPN, 0, 1, 0]);
    vm.exec();
    expect(vm.flags.equal).toBe(false);

    vm.registers[1] = 2;

    vm.exec();
    expect(vm.flags.equal).toBe(true);
});

test('CMPN negative flag', () => {
    const vm = new VM();
    vm.registers[0] = 3;
    vm.registers[1] = -2;

    vm.program = Uint8Array.from([Opcode.CMPN, 0, 1, 0]);
    vm.exec();
    expect(vm.flags.negative).toBe(false);
    expect(vm.flags.equal).toBe(false);

    vm.registers[1] = -4;

    vm.exec();
    expect(vm.flags.negative).toBe(true);
    expect(vm.flags.equal).toBe(false);

    vm.registers[1] = -3;

    vm.exec();
    expect(vm.flags.negative).toBe(false);
    expect(vm.flags.equal).toBe(true);
});

test('JEQ', () => {
    const vm = new VM();
    vm.registers[5] = 9;
    vm.program = Uint8Array.from([Opcode.JEQ, 5, 0, 0]);
    vm.flags.equal = false;

    vm.exec();
    expect(vm.registers[15]).toBe(4);

    vm.flags.equal = true;

    vm.exec();
    expect(vm.registers[15]).toBe(9);
});

test('JNEQ', () => {
    const vm = new VM();
    vm.registers[5] = 9;
    vm.program = Uint8Array.from([Opcode.JNEQ, 5, 0, 0]);
    vm.flags.equal = false;

    vm.exec();
    expect(vm.registers[15]).toBe(9);

    vm.flags.equal = true;

    vm.exec();
    expect(vm.registers[15]).toBe(4);
});

test('JLT', () => {
    const vm = new VM();
    vm.registers[5] = 9;
    vm.program = Uint8Array.from([Opcode.JLT, 5, 0, 0]);
    vm.flags.equal = false;
    vm.flags.negative = true;

    vm.exec();
    expect(vm.registers[15]).toBe(9);

    vm.flags.equal = false;
    vm.flags.negative = false;

    vm.exec();
    expect(vm.registers[15]).toBe(4);

    vm.flags.equal = true;

    vm.exec();
    expect(vm.registers[15]).toBe(4);
});

test('JGT', () => {
    const vm = new VM();
    vm.registers[5] = 9;
    vm.program = Uint8Array.from([Opcode.JGT, 5, 0, 0]);
    vm.flags.equal = false;
    vm.flags.negative = false;

    vm.exec();
    expect(vm.registers[15]).toBe(9);

    vm.flags.equal = false;
    vm.flags.negative = true;

    vm.exec();
    expect(vm.registers[15]).toBe(4);

    vm.flags.equal = true;

    vm.exec();
    expect(vm.registers[15]).toBe(4);
});

test('JLTE', () => {
    const vm = new VM();
    vm.registers[5] = 9;
    vm.program = Uint8Array.from([Opcode.JLTE, 5, 0, 0]);
    vm.flags.equal = false;
    vm.flags.negative = true;

    vm.exec();
    expect(vm.registers[15]).toBe(9);

    vm.flags.equal = false;
    vm.flags.negative = false;

    vm.exec();
    expect(vm.registers[15]).toBe(4);

    vm.flags.equal = true;

    vm.exec();
    expect(vm.registers[15]).toBe(9);

    vm.flags.equal = true;
    vm.flags.negative = true;

    vm.exec();
    expect(vm.registers[15]).toBe(9);
});

test('JGTE', () => {
    const vm = new VM();
    vm.registers[5] = 9;
    vm.program = Uint8Array.from([Opcode.JGTE, 5, 0, 0]);
    vm.flags.equal = false;
    vm.flags.negative = false;

    vm.exec();
    expect(vm.registers[15]).toBe(9);

    vm.flags.equal = false;
    vm.flags.negative = true;

    vm.exec();
    expect(vm.registers[15]).toBe(4);

    vm.flags.equal = true;

    vm.exec();
    expect(vm.registers[15]).toBe(9);

    vm.flags.equal = true;
    vm.flags.negative = false;

    vm.exec();
    expect(vm.registers[15]).toBe(9);
});

test('JEQ label', () => {
    const vm = new VM();
    vm.program = Uint8Array.from([Opcode.JEQL, 5, 0, 0]);
    vm.flags.equal = false;

    vm.exec();
    expect(vm.registers[15]).toBe(4);

    vm.flags.equal = true;

    vm.exec();
    expect(vm.registers[15]).toBe(5);
});

test('Simple PROGRAM', () => {
    const vm = new VM();

    vm.program = Uint8Array.from([
        ... HEADER_SECTION,
        Opcode.LOAD, 1,  1,  244,  // 64
        Opcode.LOAD, 2,  0,  10,   // 68
        Opcode.LOAD, 10, 0,  0,    // 72
        Opcode.LOAD, 11, 0,  100,  // 76
        Opcode.LOAD, 12, 0,  84,   // 80
        Opcode.SUB,  1,  1,  2,    // 84
        Opcode.CMP,  1,  10, 0,    // 88
        Opcode.JEQ,  11, 0,  0,    // 92
        Opcode.JMP,  12, 0,  0,    // 96
        Opcode.HALT, 0,  0,  0     // 100
    ]);

    vm.run();

    expect(vm.registers[1]).toEqual(0);
});

test('identifying HEADER', () => {
    const vm = new VM();
    vm.program = Uint8Array.from([
        ... HEADER_SECTION,
        Opcode.HALT, 0,  0,  0
    ]);

    vm.run();
    expect(vm.registers[15]).toBe(68);
});

test('throws on missing HEADER', () => {
    const vm = new VM();
    vm.program = Uint8Array.from([ Opcode.HALT, 0,  0,  0 ]);

    expect(() => {
        vm.run();
    }).toThrowError(new VMError('Bad program! No Identifying Header found!'));
});


test('throws on bad HEADER', () => {
    const vm = new VM();
    vm.program = Uint8Array.from([ ID_HEADER[0], 1, 2, 3 ]);

    expect(() => {
        vm.run();
    }).toThrowError(new VMError('Bad program! No Identifying Header found!'));
});

test('HEADER section with constants', () => {
    const vm = new VM();
    vm.program = Uint8Array.from([
        ... HEADER_SECTION_NO_BODY_OFFSET,
        68, 0, 0, 0, // index of body
        102, 111, 111, 0, // 'f' 'o' 'o' 0
        Opcode.LOAD, 1, 1, 244,
        Opcode.HALT, 0, 0, 0
    ]);

    vm.run();
    expect(vm.registers[15]).toBe(76);
});

test('PROGRAM #2', () => {
    const vm = new VM();
    vm.program = Uint8Array.from([
        ... HEADER_SECTION_NO_BODY_OFFSET,
        72, 0, 0, 0,
        102, 111, 111, 0,
        98, 97, 114 , 0,
        /* 72  */ Opcode.LOAD, 1,  0,  50,
        /* 76  */ Opcode.LOAD, 2,  0,  10,
        /* 80  */ Opcode.LOAD, 10, 0,  0,
        /* 84  */ Opcode.LOAD, 11, 0,  0,
        /* 88  */ Opcode.LOAD, 12, 0,  1,
        /* 92  */ Opcode.SUB,  1,  1,  2,
        /* 96  */ Opcode.ADD,  11, 11, 12,
        /* 100 */ Opcode.CMP,  1,  10, 0,
        /* 104 */ Opcode.JEQL, 112, 0,  0,
        /* 108 */ Opcode.JMPL, 92, 0,  0,
        /* 112 */ Opcode.HALT, 0,  0, 0
    ]);

    vm.run();
    expect(vm.registers[1]).toBe(0);
    expect(vm.registers[11]).toBe(5);
    expect(vm.registers[15]).toBe(116);
});

test('PUTS FOO', () => {
    const vm = new VM();
    vm.program = Uint8Array.from([
        ... HEADER_SECTION_NO_BODY_OFFSET,
        68, 0, 0, 0, // index of body
        102, 111, 111, 0, // 'f' 'o' 'o' 0
        Opcode.PUTS, 64, 0, 0,
        Opcode.HALT, 0, 0, 0
    ]);

    vm.run();
    expect(vm.registers[15]).toBe(76);
    expect(vm.outputBuffer).toEqual(Uint8Array.from([102, 111, 111, 0]));
});

test('SAVE [0] 10', () => {
    const vm = new VM();
    vm.program = Uint8Array.from([Opcode.SAVE, 0, 0, 10]);

    vm.exec();
    expect(vm.memory.get(0)).toBe(10);
});

test('SAVE [0] -100', () => {
    const vm = new VM();
    vm.program = Uint8Array.from([Opcode.SAVE, 0, 0, 156]);

    vm.exec();
    expect(vm.memory.get(0)).toBe(156);
});

test('SAVE [65534] 10', () => {
    const vm = new VM();
    vm.program = Uint8Array.from([Opcode.SAVE, 255, 254, 10]);

    vm.exec();
    expect(vm.memory.get(65534)).toBe(10);
});

test('SAVE [100, 255] 10', () => {
    const vm = new VM();
    vm.program = Uint8Array.from([Opcode.SAVE, 1, 99, 10]);

    vm.exec();
    expect(vm.memory.get(355)).toBe(10);
});

test('LOAD $1 [0]', () => {
    const vm = new VM();
    vm.registers[1] = 100;
    vm.program = Uint8Array.from([Opcode.LOADA, 1, 0, 0]);

    vm.exec();
    expect(vm.registers[1]).toBe(Opcode.LOADA);
});

test('LOAD $1 [100, 255]', () => {
    const vm = new VM();
    vm.program = Uint8Array.from([
        ... HEADER_SECTION,
        Opcode.SAVE, 1, 99, 10,
        Opcode.LOADA, 1, 1, 99,
        Opcode.HALT, 0, 0, 0
    ]);

    vm.run();
    expect(vm.registers[1]).toBe(10);
});

test('LOAD $1 [$2]', () => {
    const vm = new VM();
    vm.program = Uint8Array.from([
        ... HEADER_SECTION,
        Opcode.SAVE, 0, 0, 10,
        Opcode.LOAD, 2, 0, 0,
        Opcode.LOADAR, 1, 2, 0,
        Opcode.HALT, 0, 0, 0
    ]);

    vm.run();
    expect(vm.registers[1]).toBe(10);
});

test('LOAD $1 [$2, 127]', () => {
    const vm = new VM();
    vm.program = Uint8Array.from([
        ... HEADER_SECTION,
        Opcode.SAVE, 0, 127, 10,
        Opcode.LOAD, 2, 0, 0,
        Opcode.LOADAR, 1, 2, 127,
        Opcode.HALT, 0, 0, 0
    ]);

    vm.run();
    expect(vm.registers[1]).toBe(10);
});

test('SAVE [$1] 10, $1 = 32767', () => {
    const vm = new VM();
    vm.program = Uint8Array.from([
        ... HEADER_SECTION,
        Opcode.LOAD, 1, 127, 255,
        Opcode.SAVETOR, 1, 0, 10,
        Opcode.HALT, 0, 0, 0
    ]);

    vm.run();
    expect(vm.memory.get(32767)).toBe(10);
});

test('SAVE [$1] -10, $1 = 32767', () => {
    const vm = new VM();
    vm.program = Uint8Array.from([
        ... HEADER_SECTION,
        Opcode.LOAD, 1, 127, 255,
        Opcode.SAVETOR, 1, 0, 246,
        Opcode.HALT, 0, 0, 0
    ]);

    vm.run();
    expect(vm.memory.get(32767)).toBe(246);
});

test('SAVE [$1, -10] 100, $1 = 32767', () => {
    const vm = new VM();
    vm.program = Uint8Array.from([
        ... HEADER_SECTION,
        Opcode.LOAD, 1, 127, 255,
        Opcode.SAVETOR, 1, -10, 10,
        Opcode.HALT, 0, 0, 0
    ]);

    vm.run();
    expect(vm.memory.get(32767 -10)).toBe(10);
});

test('SAVE [0] $2', () => {
    const vm = new VM();
    vm.program = Uint8Array.from([
        ... HEADER_SECTION,
        Opcode.LOAD, 2, 0, 10,
        Opcode.SAVER, 0, 0, 2,
        Opcode.HALT, 0, 0, 0
    ]);

    vm.run();
    expect(vm.memory.get(0)).toBe(10);
});

test('SAVE [0] $2, $2 = 32767, overflowing int', () => {
    const vm = new VM();
    vm.program = Uint8Array.from([
        ... HEADER_SECTION,
        Opcode.LOAD, 2, 255, 254,
        Opcode.SAVER, 0, 0, 2,
        Opcode.HALT, 0, 0, 0
    ]);

    vm.run();
    expect(vm.registers[2]).toBe(-2);
    expect(vm.memory.get(0)).toBe(254);
});

test('SAVE [$1] $2, $1 = 32767', () => {
    const vm = new VM();
    vm.program = Uint8Array.from([
        ... HEADER_SECTION,
        Opcode.LOAD, 1, 127, 255,
        Opcode.LOAD, 2, 0, 10,
        Opcode.SAVERTOR, 1, 0, 2,
        Opcode.HALT, 0, 0, 0
    ]);

    vm.run();
    expect(vm.memory.get(32767)).toBe(10);
});

test('SAVE [$1, 127] $2, $1 = 32767', () => {
    const vm = new VM();
    vm.program = Uint8Array.from([
        ... HEADER_SECTION,
        Opcode.LOAD, 1, 127, 255,
        Opcode.LOAD, 2, 0, 10,
        Opcode.SAVERTOR, 1, 127, 2,
        Opcode.HALT, 0, 0, 0
    ]);

    vm.run();
    expect(vm.memory.get(32767 + 127)).toBe(10);
});

test('SAVE [$1] 10, LOAD $3 [$1] where $1 points to (256 * 256 - 1) * 256', () => {
    const vm = new VM();

    vm.program = Uint8Array.from([
        ... HEADER_SECTION,
        Opcode.LOAD,    1, 127, 255, // put (256 * 128 - 1) in $1, our memory pointer
        Opcode.LOAD,    13, 127, 255, // put (256 * 128 - 1) in $13
        Opcode.ADD,     1, 1, 13,    // add $13 to $1
        Opcode.ADDI,    1, 1, 1,     // add 1 to $1
        Opcode.LOAD,    2, 1,   0,   // put 256 in $2, our multiplier
        Opcode.MUL,     1, 1,   2,   // multiply $1 by $2
        Opcode.SAVETOR, 1, 0,   10,  // save 10 in memory at address pointed by $1
        Opcode.LOADAR,  3, 1,   0,   // load memory pointed at $1 to $3
        Opcode.HALT,    0, 0, 0
    ]);

    vm.run();
    expect(vm.registers[1]).toBe((256 * 256 - 1) * 256);
    expect(vm.memory.size).toBe(256 * 256 * 256 - 1);
    expect(vm.memory.get((256 * 256 - 1) * 256)).toBe(10);
    expect(vm.registers[3]).toBe(10);
});

test('SAVE [$1] 10, where $1 points to (256 * 256 - 1) * 256 + 255 = 256 * 256 * 256 - 1, out of bounds', () => {
    const vm = new VM();
    vm.program = Uint8Array.from([
        ... HEADER_SECTION,
        Opcode.LOAD,    1, 127, 255, // put (256 * 128 - 1) in $1, our memory pointer
        Opcode.LOAD,    13, 127, 255, // put (256 * 128 - 1) in $13
        Opcode.ADD,     1, 1, 13,    // add $13 to $1
        Opcode.ADDI,    1, 1, 1,     // add 1 to $1
        Opcode.LOAD,    2, 1,   0,   // put 256 in $2, our multiplier
        Opcode.LOAD,    3, 0,   255, // put 255 in $3, our out of bounds memory offset
        Opcode.MUL,     1, 1,   2,   // multiply $1 by $2
        Opcode.ADD,     1, 1,   3,   // add $3 to $1
        Opcode.SAVETOR, 1, 0,   10,  // save 10 in memory at address pointed by $1
        Opcode.HALT,    0, 0, 0
    ]);

    expect(() => {
        vm.run();
    }).toThrowError(new MemoryError(`Memory index ${256 * 256 * 256 - 1} out of bounds!`));

});

test('PROGRAM #3 - with memory stuff', () => {
    const vm = new VM();

    // builds [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] in memory at offset 255
    vm.program = Uint8Array.from([
        ... HEADER_SECTION,
        /* 64  */ Opcode.LOAD,     1,   0,  0,   // put 0 in $1, our start index
        /* 68  */ Opcode.LOAD,     2,   0,  9,   // put 9 in $2, our end index
        /* 72  */ Opcode.LOAD,     3,   0,  1,   // put 1 in $3, our increment
        /* 76  */ Opcode.LOAD,     4,   0,  0,   // unused
        /* 80  */ Opcode.SAVERTOR, 1, 127,  1,   // save value of $1 in memory at address [$1, 127]
        /* 84  */ Opcode.ADD,      1,   1,  3,   // add $3 (incrementer) to $1 and save it to $1
        /* 88  */ Opcode.CMP,      1,   2,  0,   // compare $1 with $2
        /* 102 */ Opcode.JLTEL,    80,  0,  0,   // jump to start of loop while $1 <= $2
        /* 106 */ Opcode.HALT,     0,   0,  0
    ]);

    vm.run();

    for (let i = 0; i <= 9; i++) {
        expect(vm.memory.get(i + 127)).toBe(i);
    }
});


test('PROGRAM #4 - with memory offset stuff', () => {
    const vm = new VM();

    // builds [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] in memory
    vm.program = Uint8Array.from([
        ... HEADER_SECTION,
        Opcode.LOAD,     1,   0,  255, // put 255 in $1, our start address
        Opcode.LOAD,     2,   0,  0, // put 0 in $2, our value
        Opcode.LOAD,     3,   0,  1, // put 1 in $3, our incrementer
        Opcode.SAVERTOR, 1,   0,  2, // put 0 in memory at address [$1, 0]
        Opcode.ADD,      2,   2,  3, // add incrementor to value ($3 to $2)
        Opcode.SAVERTOR, 1,   1,  2, // put 1 in memory at address [$1, 1]
        Opcode.ADD,      2,   2,  3, // add incrementor to value ($3 to $2)
        Opcode.SAVERTOR, 1,   2,  2, // put 2 in memory at address [$1, 2]
        Opcode.ADD,      2,   2,  3, // add incrementor to value ($3 to $2)
        Opcode.SAVERTOR, 1,   3,  2, // put 3 in memory at address [$1, 3]
        Opcode.ADD,      2,   2,  3, // add incrementor to value ($3 to $2)
        Opcode.SAVERTOR, 1,   4,  2, // put 4 in memory at address [$1, 4]
        Opcode.ADD,      2,   2,  3, // add incrementor to value ($3 to $2)
        Opcode.SAVERTOR, 1,   5,  2, // put 5 in memory at address [$1, 5]
        Opcode.ADD,      2,   2,  3, // add incrementor to value ($3 to $2)
        Opcode.SAVERTOR, 1,   6,  2, // put 6 in memory at address [$1, 6]
        Opcode.ADD,      2,   2,  3, // add incrementor to value ($3 to $2)
        Opcode.SAVERTOR, 1,   7,  2, // put 7 in memory at address [$1, 7]
        Opcode.ADD,      2,   2,  3, // add incrementor to value ($3 to $2)
        Opcode.SAVERTOR, 1,   8,  2, // put 8 in memory at address [$1, 8]
        Opcode.ADD,      2,   2,  3, // add incrementor to value ($3 to $2)
        Opcode.SAVERTOR, 1,   9,  2, // put 9 in memory at address [$1, 9]
        Opcode.HALT,     0,   0,  0
    ]);

    vm.run();

    for (let i = 0; i <= 9; i++) {
        expect(vm.memory.get(i + 255)).toBe(i);
    }
});

test('PUSH $1', () => {
    const vm = new VM();
    vm.registers[1] = 256 * 128 - 1;

    vm.program = Uint8Array.from([Opcode.PUSH, 1, 0, 0]);

    vm.exec();

    expect(vm.registers[13]).toBe(VM.MEMORY_SIZE - 7);

    expect(vm.memory.get(vm.registers[13] + 1)).toBe(0);
    expect(vm.memory.get(vm.registers[13] + 2)).toBe(0);
    expect(vm.memory.get(vm.registers[13] + 3)).toBe(127);
    expect(vm.memory.get(vm.registers[13] + 4)).toBe(255);
});

test('POP $2', () => {
    const vm = new VM();
    vm.program = Uint8Array.from([
        ... HEADER_SECTION,
        Opcode.LOAD, 1, 127, 255,
        Opcode.PUSH, 1, 0, 0,
        Opcode.POP,  2, 0, 0,
        Opcode.HALT, 0, 0, 0
    ]);

    vm.run();
    expect(vm.registers[13]).toBe(VM.MEMORY_SIZE - 3);
    expect(vm.registers[2]).toBe(256 * 128 - 1);
});

test('PUSH { $0 }', () => {
    const vm = new VM();
    vm.registers[0] = 256 * 128 - 1;

    vm.program = Uint8Array.from([Opcode.PUSHM,0, 0, 1]);

    vm.exec();

    expect(vm.registers[13]).toBe(VM.MEMORY_SIZE - 7);

    expect(vm.memory.get(vm.registers[13] + 1)).toBe(0);
    expect(vm.memory.get(vm.registers[13] + 2)).toBe(0);
    expect(vm.memory.get(vm.registers[13] + 3)).toBe(127);
    expect(vm.memory.get(vm.registers[13] + 4)).toBe(255);
});

test('PUSH { $1 }', () => {
    const vm = new VM();
    vm.registers[1] = 256 * 128 - 1;

    vm.program = Uint8Array.from([ Opcode.PUSHM, 0, 0, 17]);

    vm.exec();

    expect(vm.registers[13]).toBe(VM.MEMORY_SIZE - 7);

    expect(vm.memory.get(vm.registers[13] + 1)).toBe(0);
    expect(vm.memory.get(vm.registers[13] + 2)).toBe(0);
    expect(vm.memory.get(vm.registers[13] + 3)).toBe(127);
    expect(vm.memory.get(vm.registers[13] + 4)).toBe(255);
});

test('PUSH { $2 }', () => {
    const vm = new VM();
    vm.registers[2] = 256 * 128 - 1;

    vm.program = Uint8Array.from([Opcode.PUSHM, 0, 0, 33]);

    vm.exec();

    expect(vm.registers[13]).toBe(VM.MEMORY_SIZE - 7);

    expect(vm.memory.get(vm.registers[13] + 1)).toBe(0);
    expect(vm.memory.get(vm.registers[13] + 2)).toBe(0);
    expect(vm.memory.get(vm.registers[13] + 3)).toBe(127);
    expect(vm.memory.get(vm.registers[13] + 4)).toBe(255);
});

test('PUSH { $1 $2 } -> POP { $2 $1 }', () => {
    const vm = new VM();

    vm.program = Uint8Array.from([
        ... HEADER_SECTION,
        Opcode.LOAD, 1, 0, 1,
        Opcode.LOAD, 2, 0, 2,
        Opcode.PUSHM, 0, 1, 34,
        Opcode.POPM, 0, 2, 18,
        Opcode.HALT, 0, 0, 0
    ]);

    vm.run();
    expect(vm.registers[1]).toBe(1);
    expect(vm.registers[2]).toBe(2);
    expect(vm.registers[13]).toBe(VM.MEMORY_SIZE - 3);
});

test('PUSH { $1 $2 } -> POP { $1 $2 }', () => {
    const vm = new VM();

    vm.program = Uint8Array.from([
        ... HEADER_SECTION,
        Opcode.LOAD, 1, 0, 1,
        Opcode.LOAD, 2, 0, 2,
        Opcode.PUSHM, 0, 1, 34,
        Opcode.POPM, 0, 1, 34,
        Opcode.HALT, 0, 0, 0
    ]);

    vm.run();
    expect(vm.registers[1]).toBe(2);
    expect(vm.registers[2]).toBe(1);
    expect(vm.registers[13]).toBe(VM.MEMORY_SIZE - 3);
});

test('CALL + RET', () => {
    const vm = new VM();

    vm.program = Uint8Array.from([
        ... HEADER_SECTION,
        Opcode.CALL, 72, 0, 0,
        Opcode.HALT, 0, 0, 0,
        Opcode.LOAD, 1, 0, 1,
        Opcode.RET,  0, 0, 0,
        Opcode.LOAD, 2, 0, 2
    ]);

    vm.run();
    expect(vm.registers[1]).toBe(1);
    expect(vm.registers[2]).toBe(0);
});

test('MOV', () => {
    const vm = new VM();
    vm.registers[1] = 1;
    vm.registers[2] = 2;

    vm.program = Uint8Array.from([Opcode.MOV, 1, 2, 0]);

    vm.exec();
    expect(vm.registers[1]).toBe(2);
    expect(vm.registers[2]).toBe(2);
});

test('AND', () => {
    const vm = new VM();
    vm.registers[1] = 1;
    vm.registers[2] = 3;

    vm.program = Uint8Array.from([Opcode.AND, 1, 2, 0]);

    vm.exec();
    expect(vm.registers[1]).toBe(1);
});

test('OR', () => {
    const vm = new VM();
    vm.registers[1] = 1;
    vm.registers[2] = 2;

    vm.program = Uint8Array.from([Opcode.OR, 1, 2, 0]);

    vm.exec();
    expect(vm.registers[1]).toBe(3);
});

test('XOR', () => {
    const vm = new VM();
    vm.registers[1] = 1;
    vm.registers[2] = 3;

    vm.program = Uint8Array.from([Opcode.XOR, 1, 2, 0]);

    vm.exec();
    expect(vm.registers[1]).toBe(2);
});

test('NOT', () => {
    const vm = new VM();
    vm.registers[1] = 1;

    vm.program = Uint8Array.from([Opcode.NOT,  1, 0, 0 ]);

    vm.exec();
    expect(vm.registers[1]).toBe(-2);
});

test('BIC', () => {
    const vm = new VM();
    vm.registers[1] = 15;
    vm.registers[2] = 1;

    vm.program = Uint8Array.from([Opcode.BIC, 1, 2, 0]);

    vm.exec();
    expect(vm.registers[1]).toBe(14);
});

test('ANDI', () => {
    const vm = new VM();
    vm.registers[1] = 1;

    vm.program = Uint8Array.from([Opcode.ANDI, 1, 0, 3]);

    vm.exec();
    expect(vm.registers[1]).toBe(1);
});

test('ORI', () => {
    const vm = new VM();
    vm.registers[1] = 1;

    vm.program = Uint8Array.from([Opcode.ORI, 1, 0, 2]);

    vm.exec();
    expect(vm.registers[1]).toBe(3);
});

test('XORI', () => {
    const vm = new VM();
    vm.registers[1] = 1;

    vm.program = Uint8Array.from([Opcode.XORI, 1, 0, 3]);

    vm.exec();
    expect(vm.registers[1]).toBe(2);
});

test('BICI', () => {
    const vm = new VM();
    vm.registers[1] = 15;

    vm.program = Uint8Array.from([Opcode.BICI, 1, 0, 1]);

    vm.exec();
    expect(vm.registers[1]).toBe(14);
});

test('SHL $1 $2 $3', () => {
    const vm = new VM();
    vm.registers[2] = 1;
    vm.registers[3] = 1;

    vm.program = Uint8Array.from([Opcode.SHL,  1, 2, 3]);

    vm.exec();
    expect(vm.registers[1]).toBe(2);
});

test('SHL $1 $2 1', () => {
    const vm = new VM();
    vm.registers[2] = 1;

    vm.program = Uint8Array.from([Opcode.SHLI,  1, 2, 1]);

    vm.exec();
    expect(vm.registers[1]).toBe(2);
});

test('SHR $1 $2 $3', () => {
    const vm = new VM();
    vm.registers[2] = 2;
    vm.registers[3] = 1;

    vm.program = Uint8Array.from([Opcode.SHR,  1, 2, 3]);

    vm.exec();
    expect(vm.registers[1]).toBe(1);
});

test('SHR $1 $2 1', () => {
    const vm = new VM();
    vm.registers[2] = 2;

    vm.program = Uint8Array.from([Opcode.SHRI, 1, 2, 1]);

    vm.exec();
    expect(vm.registers[1]).toBe(1);
});

test('program is part of memory', () => {
    const vm = new VM();

    vm.program = Uint8Array.from([
        ... HEADER_SECTION,
        /* 64 */ Opcode.SAVE, 0, 71, 2, // this changes the third param of LOAD at address 68 + 3 to value 2
        /* 68 */ Opcode.LOAD, 2, 0, 0,
        /* 72 */ Opcode.HALT, 0, 0, 0
    ]);

    vm.run();
    expect(vm.registers[2]).toBe(2);
});

test('stack size can be adjusted', () => {
    const vm = new VM();

    vm.program = Uint8Array.from([
        ... ID_HEADER,
        0, 10, 0, 0,
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
        Opcode.HALT, 0, 0, 0
    ]);

    vm.run();
    expect(vm.stackSize).toBe(10);
});

test('stack throws on overflow', () => {
    const vm = new VM();

    vm.program = Uint8Array.from([
        ... ID_HEADER,
        0, 12, 0, 0,
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
        Opcode.LOAD, 1, 127, 255,
        Opcode.PUSH, 1, 0, 0,
        Opcode.PUSH, 1, 0, 0,
        Opcode.PUSH, 1, 0, 0,
        Opcode.PUSH, 1, 0, 0,
        Opcode.HALT, 0, 0, 0
    ]);

    expect(() => {
        vm.run();
    }).toThrowError(new StackError('Stack overflow! Max size is 12 bytes.'));
});

test('stack throws on underflow', () => {
    const vm = new VM();

    vm.program = Uint8Array.from([
        ... ID_HEADER,
        0, 12, 0, 0,
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
        Opcode.LOAD, 1, 127, 255,
        Opcode.POP, 1, 0, 0,
        Opcode.HALT, 0, 0, 0
    ]);

    expect(() => {
        vm.run();
    }).toThrowError(new StackError('Stack underflow!'));
});
