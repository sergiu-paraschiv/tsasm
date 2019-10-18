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
    expect(vm.pc).toBe(20);
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

test('SAVE [$1] 10', () => {
    const vm = new VM();
    vm.program = Uint8Array.from([
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.LOAD, 1, 255, 254,
        Opcode.SAVETOR, 1, 10, 0,
        Opcode.HALT, 0, 0, 0
    ]);

    vm.run();
    expect(vm.memory.get(65534)).toBe(10);
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

test('SAVE [0] $2 with overflowing int', () => {
    const vm = new VM();
    vm.program = Uint8Array.from([
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.LOAD, 2, 255, 254,
        Opcode.SAVER, 0, 0, 2,
        Opcode.HALT, 0, 0, 0
    ]);

    vm.run();
    expect(vm.registers[2]).toBe(65534);
    expect(vm.memory.get(0)).toBe(254);
});

test('SAVE [$1] $2', () => {
    const vm = new VM();
    vm.program = Uint8Array.from([
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.LOAD, 1, 255, 254,
        Opcode.LOAD, 2, 0, 10,
        Opcode.SAVERTOR, 1, 2, 0,
        Opcode.HALT, 0, 0, 0
    ]);

    vm.run();
    expect(vm.memory.get(65534)).toBe(10);
});

test('SAVE [$1] 10, LOAD $3 [$1] where $1 points to (256 * 256 - 1) * 256', () => {
    const vm = new VM();
    vm.debug = true;
    vm.program = Uint8Array.from([
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.LOAD,    1, 255, 255, // put (256 * 256 - 1) in $1, our memory pointer
        Opcode.LOAD,    2, 1,   0,   // put 256 in $2, our multiplier
        Opcode.MUL,     1, 2,   1,   // multiply $1 by $2
        Opcode.SAVETOR, 1, 10,  0,   // save 10 in memory at address pointed by $1
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
    vm.debug = true;
    vm.program = Uint8Array.from([
        ... ID_HEADER,
        8, 0, 0, 0,
        Opcode.LOAD,    1, 255, 255, // put (256 * 256 - 1) in $1, our memory pointer
        Opcode.LOAD,    2, 1,   0,   // put 256 in $2, our multiplier
        Opcode.LOAD,    3, 0,   255, // put 255 in $3, our out of bounds memory offset
        Opcode.MUL,     1, 2,   1,   // multiply $1 by $2
        Opcode.ADD,     1, 3,   1,   // add $3 to $1
        Opcode.SAVETOR, 1, 10,  0,   // save 10 in memory at address pointed by $1
        Opcode.HALT,    0, 0, 0
    ]);

    expect(() => {
        vm.run();
    }).toThrowError(new MemoryError(`Memory index ${256 * 256 * 256 - 1} out of bounds!`));

});
// builds [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] in memory
test('PROGRAM #3 - with memory stuff', () => {
    const vm = new VM();
    vm.debug = true;
    vm.program = Uint8Array.from([
        /* 0  */ ... ID_HEADER,
        /* 4  */ 8, 0, 0, 0,
        /* 8 */  Opcode.LOAD,     1,   0,  0, // put 0 in $1, our start index
        /* 12 */ Opcode.LOAD,     2,   0,  9, // put 9 in $2, our end index
        /* 16 */ Opcode.LOAD,     3,   0,  1, // put 1 in $3, our increment
        /* 20 */ Opcode.LOAD,     4,   0,  24,// put 28 in $4, the start index of our "loop"
        /* 24 */ Opcode.SAVERTOR, 1,   1,  0, // save value of $1 in memory at address [$1]
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
