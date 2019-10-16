import { VM } from './VM';
import { VMError } from './VMError';
import { ID_HEADER, Opcode } from '../Instruction';


test('a VM is initialized', () => {
    const vm = new VM();
    expect(vm.registers[0]).toBe(0);
});

test('HALT', () => {
    const vm = new VM();
    vm.program = Uint8Array.from([Opcode.HALT, 0, 0, 0]);
    vm.exec();
    expect(vm.pc).toBe(4);
});

test('ILGL', () => {
    expect(() => {
        const vm = new VM();
        vm.program = Uint8Array.from([200, 0, 0, 0]);
        vm.exec();
        expect(vm.pc).toBe(1);
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

test('opcode SUB', () => {
    const vm = new VM();
    vm.registers[0] = 500;
    vm.registers[1] = 10;
    vm.program = Uint8Array.from([Opcode.SUB, 0, 1, 2]);
    vm.exec();
    expect(vm.registers[2]).toBe(490);
});

test('MUL', () => {
    const vm = new VM();
    vm.registers[0] = 500;
    vm.registers[1] = 10;
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

test('DIV (remainder)', () => {
    const vm = new VM();
    vm.registers[0] = 500;
    vm.registers[1] = 9;
    vm.program = Uint8Array.from([Opcode.DIV, 0, 1, 2]);
    vm.exec();
    expect(vm.registers[2]).toBe(55);
    expect(vm.flags.remainder).toBe(5);
});

test('JMP', () => {
    const vm = new VM();
    vm.registers[5] = 9;
    vm.program = Uint8Array.from([Opcode.JMP, 5, 0, 0]);
    vm.exec();
    expect(vm.pc).toBe(9);
});

test('JMPF', () => {
    const vm = new VM();
    vm.registers[2] = 4;
    vm.program = Uint8Array.from([Opcode.JMPF, 2, 0, 0]);
    vm.exec();
    expect(vm.pc).toBe(8);
});

test('JMPB', () => {
    const vm = new VM();
    vm.registers[2] = 4;
    vm.program = Uint8Array.from([Opcode.JMPB, 2, 0, 0]);
    vm.exec();
    expect(vm.pc).toBe(0);
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

test('JEQ', () => {
    const vm = new VM();
    vm.registers[5] = 9;
    vm.program = Uint8Array.from([Opcode.JEQ, 5, 0, 0]);
    vm.flags.equal = false;

    vm.exec();
    expect(vm.pc).toBe(4);

    vm.flags.equal = true;

    vm.exec();
    expect(vm.pc).toBe(9);
});

test('JNEQ', () => {
    const vm = new VM();
    vm.registers[5] = 9;
    vm.program = Uint8Array.from([Opcode.JNEQ, 5, 0, 0]);
    vm.flags.equal = false;

    vm.exec();
    expect(vm.pc).toBe(9);

    vm.flags.equal = true;

    vm.exec();
    expect(vm.pc).toBe(4);
});

test('JLT', () => {
    const vm = new VM();
    vm.registers[5] = 9;
    vm.program = Uint8Array.from([Opcode.JLT, 5, 0, 0]);
    vm.flags.equal = false;
    vm.flags.negative = true;

    vm.exec();
    expect(vm.pc).toBe(9);

    vm.flags.equal = false;
    vm.flags.negative = false;

    vm.exec();
    expect(vm.pc).toBe(4);

    vm.flags.equal = true;

    vm.exec();
    expect(vm.pc).toBe(4);
});

test('JGT', () => {
    const vm = new VM();
    vm.registers[5] = 9;
    vm.program = Uint8Array.from([Opcode.JGT, 5, 0, 0]);
    vm.flags.equal = false;
    vm.flags.negative = false;

    vm.exec();
    expect(vm.pc).toBe(9);

    vm.flags.equal = false;
    vm.flags.negative = true;

    vm.exec();
    expect(vm.pc).toBe(4);

    vm.flags.equal = true;

    vm.exec();
    expect(vm.pc).toBe(4);
});

test('JLTE', () => {
    const vm = new VM();
    vm.registers[5] = 9;
    vm.program = Uint8Array.from([Opcode.JLTE, 5, 0, 0]);
    vm.flags.equal = false;
    vm.flags.negative = true;

    vm.exec();
    expect(vm.pc).toBe(9);

    vm.flags.equal = false;
    vm.flags.negative = false;

    vm.exec();
    expect(vm.pc).toBe(4);

    vm.flags.equal = true;

    vm.exec();
    expect(vm.pc).toBe(9);

    vm.flags.equal = true;
    vm.flags.negative = true;

    vm.exec();
    expect(vm.pc).toBe(9);
});

test('JGTE', () => {
    const vm = new VM();
    vm.registers[5] = 9;
    vm.program = Uint8Array.from([Opcode.JGTE, 5, 0, 0]);
    vm.flags.equal = false;
    vm.flags.negative = false;

    vm.exec();
    expect(vm.pc).toBe(9);

    vm.flags.equal = false;
    vm.flags.negative = true;

    vm.exec();
    expect(vm.pc).toBe(4);

    vm.flags.equal = true;

    vm.exec();
    expect(vm.pc).toBe(9);

    vm.flags.equal = true;
    vm.flags.negative = false;

    vm.exec();
    expect(vm.pc).toBe(9);
});

test('JEQ label', () => {
    const vm = new VM();
    vm.program = Uint8Array.from([Opcode.JEQL, 5, 0, 0]);
    vm.flags.equal = false;

    vm.exec();
    expect(vm.pc).toBe(4);

    vm.flags.equal = true;

    vm.exec();
    expect(vm.pc).toBe(5);
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
    expect(vm.pc).toBe(12);
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
    expect(vm.pc).toBe(20);
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
    expect(vm.pc).toBe(60);
});

