import { Instruction, Opcode } from './Instruction';


test('HALT opcode can be created', () => {
    const opcode_HALT = Opcode.HALT;
    expect(opcode_HALT).toBe(Opcode.HALT);
});

test('HALT instruction can be created', () => {
    const instruction_HALT = new Instruction(Opcode.HALT);
    expect(instruction_HALT.opcode).toBe(Opcode.HALT);
});