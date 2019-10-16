import { Opcode } from './Instruction';


test('HALT opcode can be created', () => {
    const opcode_HALT = Opcode.HALT;
    expect(opcode_HALT).toBe(Opcode.HALT);
});
