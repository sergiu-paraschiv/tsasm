import { VM } from './VM';
import { VMError } from './VMError';
import { ID_HEADER, Opcode } from '../Instruction';
import { MemoryError } from './MemoryError';


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
    vm.program = Uint8Array.from([Opcode.ADD, 0, 1, 2]);
    vm.exec();
    expect(vm.registers[2]).toBe(510);
});

test('ADD with negative numbers 1', () => {
    const vm = new VM();
    vm.registers[0] = 500;
    vm.registers[1] = -10;
    vm.program = Uint8Array.from([Opcode.ADD, 0, 1, 2]);
    vm.exec();
    expect(vm.registers[2]).toBe(490);
});

test('ADD with negative numbers 2', () => {
    const vm = new VM();
    vm.registers[0] = -500;
    vm.registers[1] = -10;
    vm.program = Uint8Array.from([Opcode.ADD, 0, 1, 2]);
    vm.exec();
    expect(vm.registers[2]).toBe(-510);
});

test('ADD with immediate', () => {
    const vm = new VM();
    vm.registers[0] = 500;
    vm.program = Uint8Array.from([Opcode.ADDI, 0, 10, 2]);
    vm.exec();
    expect(vm.registers[2]).toBe(510);
});

test('ADD with negative immediate', () => {
    const vm = new VM();
    vm.registers[0] = 500;
    vm.program = Uint8Array.from([Opcode.ADDI, 0, -10, 2]);
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
    vm.program = Uint8Array.from([Opcode.SUB, 0, 1, 2]);
    vm.exec();
    expect(vm.registers[2]).toBe(490);
});

test('SUB with immediate', () => {
    const vm = new VM();
    vm.registers[0] = 500;
    vm.program = Uint8Array.from([Opcode.SUBI, 0, 10, 2]);
    vm.exec();
    expect(vm.registers[2]).toBe(490);
});

test('SUB with negative immediate', () => {
    const vm = new VM();
    vm.registers[0] = 500;
    vm.program = Uint8Array.from([Opcode.SUBI, 0, -10, 2]);
    vm.exec();
    expect(vm.registers[2]).toBe(510);
});

test('SUB with negative numbers 1', () => {
    const vm = new VM();
    vm.registers[0] = 500;
    vm.registers[1] = -10;
    vm.program = Uint8Array.from([Opcode.SUB, 0, 1, 2]);
    vm.exec();
    expect(vm.registers[2]).toBe(510);
});

test('SUB with negative numbers 2', () => {
    const vm = new VM();
    vm.registers[0] = -500;
    vm.registers[1] = 10;
    vm.program = Uint8Array.from([Opcode.SUB, 0, 1, 2]);
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
    vm.program = Uint8Array.from([Opcode.MUL, 0, 1, 2]);
    vm.exec();
    expect(vm.registers[2]).toBe(5000);
});

test('MUL with immediate', () => {
    const vm = new VM();
    vm.registers[0] = 500;
    vm.program = Uint8Array.from([Opcode.MULI, 0, 10, 2]);
    vm.exec();
    expect(vm.registers[2]).toBe(5000);
});

test('MUL with negative immediate', () => {
    const vm = new VM();
    vm.registers[0] = 500;
    vm.program = Uint8Array.from([Opcode.MULI, 0, -10, 2]);
    vm.exec();
    expect(vm.registers[2]).toBe(-5000);
});


test('MUL with negative numbers 1', () => {
    const vm = new VM();
    vm.registers[0] = 500;
    vm.registers[1] = -10;
    vm.program = Uint8Array.from([Opcode.MUL, 0, 1, 2]);
    vm.exec();
    expect(vm.registers[2]).toBe(-5000);
});

test('MUL with negative numbers 2', () => {
    const vm = new VM();
    vm.registers[0] = -500;
    vm.registers[1] = -10;
    vm.program = Uint8Array.from([Opcode.MUL, 0, 1, 2]);
    vm.exec();
    expect(vm.registers[2]).toBe(5000);
});

test('DIV (no remainder)', () => {
    const vm = new VM();
    vm.registers[0] = 500;
    vm.registers[1] = 10;
    vm.program = Uint8Array.from([Opcode.DIV, 0, 1, 2]);
    vm.exec();
    expect(vm.registers[2]).toBe(50);
});

test('DIV with immediate', () => {
    const vm = new VM();
    vm.registers[0] = 505;
    vm.program = Uint8Array.from([Opcode.DIVI, 0, 10, 2]);
    vm.exec();
    expect(vm.registers[2]).toBe(50);
    expect(vm.flags.remainder).toBe(5);
});

test('DIV with negative immediate', () => {
    const vm = new VM();
    vm.registers[0] = 505;
    vm.program = Uint8Array.from([Opcode.DIVI, 0, -10, 2]);
    vm.exec();
    expect(vm.registers[2]).toBe(-50);
    expect(vm.flags.remainder).toBe(5);
});

test('DIV with remainder', () => {
    const vm = new VM();
    vm.registers[0] = 500;
    vm.registers[1] = 9;
    vm.program = Uint8Array.from([Opcode.DIV, 0, 1, 2]);
    vm.exec();
    expect(vm.registers[2]).toBe(55);
    expect(vm.flags.remainder).toBe(5);
});

test('DIV with negative numbers 1', () => {
    const vm = new VM();
    vm.registers[0] = 500;
    vm.registers[1] = -10;
    vm.program = Uint8Array.from([Opcode.DIV, 0, 1, 2]);
    vm.exec();
    expect(vm.registers[2]).toBe(-50);
});

test('DIV with negative numbers 2', () => {
    const vm = new VM();
    vm.registers[0] = -500;
    vm.registers[1] = -10;
    vm.program = Uint8Array.from([Opcode.DIV, 0, 1, 2]);
    vm.exec();
    expect(vm.registers[2]).toBe(50);
});

test('DIV with negative number and remainder', () => {
    const vm = new VM();
    vm.registers[0] = 500;
    vm.registers[1] = -9;
    vm.program = Uint8Array.from([Opcode.DIV, 0, 1, 2]);
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
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.LOAD, 1,  1,  244,  // 8
        Opcode.LOAD, 2,  0,  10,   // 12
        Opcode.LOAD, 10, 0,  0,    // 16
        Opcode.LOAD, 11, 0,  44,   // 20
        Opcode.LOAD, 12, 0,  28,   // 24
        Opcode.SUB,  1,  2,  1,    // 28
        Opcode.CMP,  1,  10, 0,    // 32
        Opcode.JEQ,  11, 0,  0,    // 36
        Opcode.JMP,  12, 0,  0,    // 40
        Opcode.HALT, 0,  0,  0     // 44
    ]);

    vm.run();

    expect(vm.registers[1]).toEqual(0);
});

test('identifying HEADER', () => {
    const vm = new VM();
    vm.program = Uint8Array.from([
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.HALT, 0,  0,  0
    ]);

    vm.run();
    expect(vm.registers[15]).toBe(12);
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
        ... ID_HEADER,
        12, 0, 0, 0, // index of body
        102, 111, 111, 0, // 'f' 'o' 'o' 0
        Opcode.LOAD, 1, 1, 244,
        Opcode.HALT, 0, 0, 0
    ]);

    vm.run();
    expect(vm.registers[15]).toBe(20);
});

test('PROGRAM #2', () => {
    const vm = new VM();
    vm.program = Uint8Array.from([
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
    ]);

    vm.run();
    expect(vm.registers[1]).toBe(0);
    expect(vm.registers[11]).toBe(5);
    expect(vm.registers[15]).toBe(60);
});

test('PUTS FOO', () => {
    const vm = new VM();
    vm.program = Uint8Array.from([
        ... ID_HEADER,
        12, 0, 0, 0, // index of body
        102, 111, 111, 0, // 'f' 'o' 'o' 0
        Opcode.PUTS, 8, 0, 0,
        Opcode.HALT, 0, 0, 0
    ]);

    vm.run();
    expect(vm.registers[15]).toBe(20);
    expect(vm.outputBuffer).toEqual(Uint8Array.from([102, 111, 111, 0]));
});

test('SAVE [0] 10', () => {
    const vm = new VM();
    vm.program = Uint8Array.from([
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.SAVE, 0, 0, 10,
        Opcode.HALT, 0, 0, 0
    ]);

    vm.run();
    expect(vm.memory.get(0)).toBe(10);
});

test('SAVE [0] -100', () => {
    const vm = new VM();
    vm.program = Uint8Array.from([
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.SAVE, 0, 0, 156,
        Opcode.HALT, 0, 0, 0
    ]);

    vm.run();
    expect(vm.memory.get(0)).toBe(156);
});

test('SAVE [65534] 10', () => {
    const vm = new VM();
    vm.program = Uint8Array.from([
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.SAVE, 255, 254, 10,
        Opcode.HALT, 0, 0, 0
    ]);

    vm.run();
    expect(vm.memory.get(65534)).toBe(10);
});

test('SAVE [100, 255] 10', () => {
    const vm = new VM();
    vm.program = Uint8Array.from([
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.SAVE, 1, 99, 10,
        Opcode.HALT, 0, 0, 0
    ]);

    vm.run();
    expect(vm.memory.get(355)).toBe(10);
});

test('LOAD $1 [0]', () => {
    const vm = new VM();
    vm.program = Uint8Array.from([
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.SAVE, 0, 0, 10,
        Opcode.LOADA, 1, 0, 0,
        Opcode.HALT, 0, 0, 0
    ]);

    vm.run();
    expect(vm.registers[1]).toBe(10);
});

test('LOAD $1 [100, 255]', () => {
    const vm = new VM();
    vm.program = Uint8Array.from([
        ... ID_HEADER,
        8, 0, 0, 0,
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
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.SAVE, 0, 0, 10,
        Opcode.LOAD, 2, 0, 0,
        Opcode.LOADAR, 1, 2, 0,
        Opcode.HALT, 0, 0, 0
    ]);

    vm.run();
    expect(vm.registers[1]).toBe(10);
});

test('LOAD $1 [$2, 255]', () => {
    const vm = new VM();
    vm.program = Uint8Array.from([
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.SAVE, 0, 255, 10,
        Opcode.LOAD, 2, 0, 0,
        Opcode.LOADAR, 1, 2, 255,
        Opcode.HALT, 0, 0, 0
    ]);

    vm.run();
    expect(vm.registers[1]).toBe(10);
});

test('SAVE [$1] 10, $1 = 32767', () => {
    const vm = new VM();
    vm.program = Uint8Array.from([
        ... ID_HEADER,
        8, 0, 0, 0,
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
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.LOAD, 1, 127, 255,
        Opcode.SAVETOR, 1, 0, 246,
        Opcode.HALT, 0, 0, 0
    ]);

    vm.run();
    expect(vm.memory.get(32767)).toBe(246);
});

test('SAVE [$1, 255] 100, $1 = 32767', () => {
    const vm = new VM();
    vm.program = Uint8Array.from([
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.LOAD, 1, 127, 255,
        Opcode.SAVETOR, 1, 255, 10,
        Opcode.HALT, 0, 0, 0
    ]);

    vm.run();
    expect(vm.memory.get(32767 + 255)).toBe(10);
});

test('SAVE [0] $2', () => {
    const vm = new VM();
    vm.program = Uint8Array.from([
        ... ID_HEADER,
        8, 0, 0, 0,
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
        ... ID_HEADER,
        8, 0, 0, 0,
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
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.LOAD, 1, 127, 255,
        Opcode.LOAD, 2, 0, 10,
        Opcode.SAVERTOR, 1, 0, 2,
        Opcode.HALT, 0, 0, 0
    ]);

    vm.run();
    expect(vm.memory.get(32767)).toBe(10);
});

test('SAVE [$1, 255] $2, $1 = 32767', () => {
    const vm = new VM();
    vm.program = Uint8Array.from([
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.LOAD, 1, 127, 255,
        Opcode.LOAD, 2, 0, 10,
        Opcode.SAVERTOR, 1, 255, 2,
        Opcode.HALT, 0, 0, 0
    ]);

    vm.run();
    expect(vm.memory.get(32767 + 255)).toBe(10);
});

test('SAVE [$1] 10, LOAD $3 [$1] where $1 points to (256 * 256 - 1) * 256', () => {
    const vm = new VM();

    vm.program = Uint8Array.from([
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.LOAD,    1, 127, 255, // put (256 * 128 - 1) in $1, our memory pointer
        Opcode.LOAD,    13, 127, 255, // put (256 * 128 - 1) in $13
        Opcode.ADD,     1, 13, 1,    // add $13 to $1
        Opcode.ADDI,    1, 1, 1,     // add 1 to $1
        Opcode.LOAD,    2, 1,   0,   // put 256 in $2, our multiplier
        Opcode.MUL,     1, 2,   1,   // multiply $1 by $2
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
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.LOAD,    1, 127, 255, // put (256 * 128 - 1) in $1, our memory pointer
        Opcode.LOAD,    13, 127, 255, // put (256 * 128 - 1) in $13
        Opcode.ADD,     1, 13, 1,    // add $13 to $1
        Opcode.ADDI,    1, 1, 1,     // add 1 to $1
        Opcode.LOAD,    2, 1,   0,   // put 256 in $2, our multiplier
        Opcode.LOAD,    3, 0,   255, // put 255 in $3, our out of bounds memory offset
        Opcode.MUL,     1, 2,   1,   // multiply $1 by $2
        Opcode.ADD,     1, 3,   1,   // add $3 to $1
        Opcode.SAVETOR, 1, 0,   10,  // save 10 in memory at address pointed by $1
        Opcode.HALT,    0, 0, 0
    ]);

    expect(() => {
        vm.run();
    }).toThrowError(new MemoryError(`Memory index ${256 * 256 * 256 - 1} out of bounds!`));

});

test('PROGRAM #3 - with memory stuff', () => {
    const vm = new VM();

    // builds [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] in memory
    vm.program = Uint8Array.from([
        /* 0  */ ... ID_HEADER,
        /* 4  */ 8, 0, 0, 0,
        /* 8 */  Opcode.LOAD,     1,   0,  0, // put 0 in $1, our start index
        /* 12 */ Opcode.LOAD,     2,   0,  9, // put 9 in $2, our end index
        /* 16 */ Opcode.LOAD,     3,   0,  1, // put 1 in $3, our increment
        /* 20 */ Opcode.LOAD,     4,   0,  24,// put 28 in $4, the start index of our "loop"
        /* 24 */ Opcode.SAVERTOR, 1,   0,  1, // save value of $1 in memory at address [$1]
        /* 28 */ Opcode.ADD,      1,   3,  1, // add $3 (incrementer) to $1 and save it to $1
        /* 32 */ Opcode.CMP,      1,   2,  0, // compare $1 with $2
        /* 36 */ Opcode.JLTE,     4,   0,  0, // jump to start of loop while $1 <= $2
        /* 40 */ Opcode.HALT,     0,   0,  0
    ]);

    vm.run();

    expect(vm.memory.get(0)).toBe(0);
    expect(vm.memory.get(1)).toBe(1);
    expect(vm.memory.get(2)).toBe(2);
    expect(vm.memory.get(3)).toBe(3);
    expect(vm.memory.get(4)).toBe(4);
    expect(vm.memory.get(5)).toBe(5);
    expect(vm.memory.get(6)).toBe(6);
    expect(vm.memory.get(7)).toBe(7);
    expect(vm.memory.get(8)).toBe(8);
    expect(vm.memory.get(9)).toBe(9);
});


test('PROGRAM #4 - with memory offset stuff', () => {
    const vm = new VM();

    // builds [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] in memory
    vm.program = Uint8Array.from([
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.LOAD,     1,   0,  0, // put 0 in $1, our start address
        Opcode.LOAD,     2,   0,  0, // put 0 in $2, our value
        Opcode.LOAD,     3,   0,  1, // put 1 in $3, our incrementer
        Opcode.SAVERTOR, 1,   0,  2, // put 0 in memory at address [$1, 0]
        Opcode.ADD,      2,   3,  2, // add incrementor to value ($3 to $2)
        Opcode.SAVERTOR, 1,   1,  2, // put 1 in memory at address [$1, 1]
        Opcode.ADD,      2,   3,  2, // add incrementor to value ($3 to $2)
        Opcode.SAVERTOR, 1,   2,  2, // put 2 in memory at address [$1, 2]
        Opcode.ADD,      2,   3,  2, // add incrementor to value ($3 to $2)
        Opcode.SAVERTOR, 1,   3,  2, // put 3 in memory at address [$1, 3]
        Opcode.ADD,      2,   3,  2, // add incrementor to value ($3 to $2)
        Opcode.SAVERTOR, 1,   4,  2, // put 4 in memory at address [$1, 4]
        Opcode.ADD,      2,   3,  2, // add incrementor to value ($3 to $2)
        Opcode.SAVERTOR, 1,   5,  2, // put 5 in memory at address [$1, 5]
        Opcode.ADD,      2,   3,  2, // add incrementor to value ($3 to $2)
        Opcode.SAVERTOR, 1,   6,  2, // put 6 in memory at address [$1, 6]
        Opcode.ADD,      2,   3,  2, // add incrementor to value ($3 to $2)
        Opcode.SAVERTOR, 1,   7,  2, // put 7 in memory at address [$1, 7]
        Opcode.ADD,      2,   3,  2, // add incrementor to value ($3 to $2)
        Opcode.SAVERTOR, 1,   8,  2, // put 8 in memory at address [$1, 8]
        Opcode.ADD,      2,   3,  2, // add incrementor to value ($3 to $2)
        Opcode.SAVERTOR, 1,   9,  2, // put 9 in memory at address [$1, 9]
        Opcode.HALT,     0,   0,  0
    ]);

    vm.run();

    expect(vm.memory.get(0)).toBe(0);
    expect(vm.memory.get(1)).toBe(1);
    expect(vm.memory.get(2)).toBe(2);
    expect(vm.memory.get(3)).toBe(3);
    expect(vm.memory.get(4)).toBe(4);
    expect(vm.memory.get(5)).toBe(5);
    expect(vm.memory.get(6)).toBe(6);
    expect(vm.memory.get(7)).toBe(7);
    expect(vm.memory.get(8)).toBe(8);
    expect(vm.memory.get(9)).toBe(9);
});

test('PUSH $1', () => {
    const vm = new VM();
    vm.program = Uint8Array.from([
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.LOAD, 1, 127, 255,
        Opcode.PUSH, 1, 0, 0,
        Opcode.HALT, 0, 0, 0
    ]);

    vm.run();
    expect(vm.stack.pointer!.value).toBe(256 * 128 - 1);
});

test('POP $2', () => {
    const vm = new VM();
    vm.program = Uint8Array.from([
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.LOAD, 1, 127, 255,
        Opcode.PUSH, 1, 0, 0,
        Opcode.POP,  2, 0, 0,
        Opcode.HALT, 0, 0, 0
    ]);

    vm.run();
    expect(vm.stack.pointer).toBeUndefined();
    expect(vm.registers[2]).toBe(256 * 128 - 1);
});

test('PUSH { $0 }', () => {
    const vm = new VM();

    vm.program = Uint8Array.from([
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.LOAD, 0, 127, 255,
        Opcode.PUSHM,0, 0, 1,
        Opcode.HALT, 0, 0, 0
    ]);

    vm.run();
    expect(vm.stack.pointer!.value).toBe(256 * 128 - 1);
});

test('PUSH { $1 }', () => {
    const vm = new VM();

    vm.program = Uint8Array.from([
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.LOAD, 1, 127, 255,
        Opcode.PUSHM, 0, 0, 17,
        Opcode.HALT, 0, 0, 0
    ]);

    vm.run();
    expect(vm.stack.pointer!.value).toBe(256 * 128 - 1);
});

test('PUSH { $2 }', () => {
    const vm = new VM();

    vm.program = Uint8Array.from([
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.LOAD, 2, 127, 255,
        Opcode.PUSHM, 0, 0, 33,
        Opcode.HALT, 0, 0, 0
    ]);

    vm.run();
    expect(vm.stack.pointer!.value).toBe(256 * 128 - 1);
});

test('PUSH { $1 $2 } -> POP { $2 $1 }', () => {
    const vm = new VM();

    vm.program = Uint8Array.from([
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.LOAD, 1, 0, 1,
        Opcode.LOAD, 2, 0, 2,
        Opcode.PUSHM, 0, 1, 34,
        Opcode.POPM, 0, 2, 18,
        Opcode.HALT, 0, 0, 0
    ]);

    vm.run();
    expect(vm.registers[1]).toBe(1);
    expect(vm.registers[2]).toBe(2);
});

test('PUSH { $1 $2 } -> POP { $1 $2 }', () => {
    const vm = new VM();

    vm.program = Uint8Array.from([
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.LOAD, 1, 0, 1,
        Opcode.LOAD, 2, 0, 2,
        Opcode.PUSHM, 0, 1, 34,
        Opcode.POPM, 0, 1, 34,
        Opcode.HALT, 0, 0, 0
    ]);

    vm.run();
    expect(vm.registers[1]).toBe(2);
    expect(vm.registers[2]).toBe(1);
});

test('CALL + RET', () => {
    const vm = new VM();

    vm.program = Uint8Array.from([
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.CALL, 16, 0, 0,
        Opcode.HALT, 0, 0, 0,
        Opcode.LOAD, 1, 0, 1,
        Opcode.RET, 0, 0, 0,
        Opcode.LOAD, 2, 0, 2
    ]);

    vm.run();
    expect(vm.registers[1]).toBe(1);
    expect(vm.registers[2]).toBe(0);
});

test('MOV', () => {
    const vm = new VM();

    vm.program = Uint8Array.from([
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.LOAD, 1, 0, 1,
        Opcode.LOAD, 2, 0, 2,
        Opcode.MOV,  1, 2, 0,
        Opcode.HALT, 0, 0, 0
    ]);

    vm.run();
    expect(vm.registers[1]).toBe(2);
    expect(vm.registers[2]).toBe(2);
});

test('AND', () => {
    const vm = new VM();

    vm.program = Uint8Array.from([
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.LOAD, 1, 0, 1,
        Opcode.LOAD, 2, 0, 3,
        Opcode.AND,  1, 2, 0,
        Opcode.HALT, 0, 0, 0
    ]);

    vm.run();
    expect(vm.registers[1]).toBe(1);
});

test('OR', () => {
    const vm = new VM();

    vm.program = Uint8Array.from([
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.LOAD, 1, 0, 1,
        Opcode.LOAD, 2, 0, 2,
        Opcode.OR,  1, 2, 0,
        Opcode.HALT, 0, 0, 0
    ]);

    vm.run();
    expect(vm.registers[1]).toBe(3);
});

test('XOR', () => {
    const vm = new VM();

    vm.program = Uint8Array.from([
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.LOAD, 1, 0, 1,
        Opcode.LOAD, 2, 0, 3,
        Opcode.XOR,  1, 2, 0,
        Opcode.HALT, 0, 0, 0
    ]);

    vm.run();
    expect(vm.registers[1]).toBe(2);
});

test('NOT', () => {
    const vm = new VM();

    vm.program = Uint8Array.from([
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.LOAD, 1, 0, 1,
        Opcode.NOT,  1, 0, 0,
        Opcode.HALT, 0, 0, 0
    ]);

    vm.run();
    expect(vm.registers[1]).toBe(-2);
});

test('BIC', () => {
    const vm = new VM();

    vm.program = Uint8Array.from([
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.LOAD, 1, 0, 15,
        Opcode.LOAD, 2, 0, 1,
        Opcode.BIC,  1, 2, 0,
        Opcode.HALT, 0, 0, 0
    ]);

    vm.run();
    expect(vm.registers[1]).toBe(14);
});