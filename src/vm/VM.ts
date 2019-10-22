import { ID_HEADER, Opcode } from '../Instruction';
import { VMError } from './VMError';
import { Memory } from './Memory';
import { StackError } from './StackError';


export class VM {
    public static MEMORY_SIZE = 256 * 256 * 256 - 1;

    public debug: boolean;

    public registers: Int32Array;
    public flags: {
        remainder: number;
        equal: boolean;
        negative: boolean;
    };
    public totalIterations: number;
    public outputBuffer: Uint8Array;
    public memory: Memory;

    private _stackSize: number;
    private breakpoints: number[];
    private ignoreNextBreakpoint: boolean;
    private paused: boolean;
    private stopCallback: undefined | (() => void);
    private forceStop: boolean;
    private afterInstructionRunCallback: undefined | ((iterations: number) => void);

    constructor() {
        this.debug = false;
        this.reset();
    }

    public reset() {
        this.registers = new Int32Array(16);
        this.flags = {
            remainder: 0,
            equal: false,
            negative: false
        };
        this.totalIterations = 0;
        this.outputBuffer = new Uint8Array();
        this.memory = new Memory(VM.MEMORY_SIZE);
        this._stackSize = 256 * 256 - 3;

        this.sp = VM.MEMORY_SIZE - 3;

        this.breakpoints = [];
        this.ignoreNextBreakpoint = false;
        this.paused = false;
        this.forceStop = false;
    }

    private get sp(): number {
        return this.registers[13];
    }

    private set sp(value: number) {
        this.registers[13] = value;
    }

    private get lr(): number {
        return this.registers[14];
    }

    private set lr(value: number) {
        this.registers[14] = value;
    }

    private get pc(): number {
        return this.registers[15];
    }

    private set pc(value: number) {
        this.registers[15] = value;
    }

    public get stackSize(): number {
        return this._stackSize;
    }

    public set program(data: Uint8Array) {
        for (let i = 0; i < data.length; i++) {
            this.memory.set(i, data[i]);
        }
    }

    public get program(): Uint8Array {
        return this.memory.data;
    }

    public run() {
        this.ensureIdentifyingHeader();
        this.consumeHeaderSection();
        this.runMainLoop();
    }

    public continue() {
        this.ignoreNextBreakpoint = true;
        this.runMainLoop();
    }

    public exec() {
        this.pc = 0;
        this.executeInstruction();
        this.callAfterInstructionRunCallback();
    }

    public setBreakpoints(breakpoints: number[]) {
        this.breakpoints = breakpoints;
    }

    public stop() {
        this.forceStop = true;
        this.runMainLoop();
    }

    public onStop(callback: () => void) {
        this.stopCallback = callback;
    }

    public isPaused(): boolean {
        return this.paused;
    }

    public afterInstructionRun(callback: (iterations: number) => void) {
        this.afterInstructionRunCallback = callback;
    }

    private runMainLoop() {
        let isDone = false;

        while (!isDone)
        {
            isDone = this.executeInstruction();
        }
    }

    private ensureIdentifyingHeader(): void {
        const opcode = this.decodeOpcode();

        if (opcode !== Opcode.HEAD) {
            throw new VMError('Bad program! No Identifying Header found!');
        }

        if (this.next8Bits() !== ID_HEADER[1]) {
            throw new VMError('Bad program! No Identifying Header found!');
        }

        if (this.next8Bits() !== ID_HEADER[2]) {
            throw new VMError('Bad program! No Identifying Header found!');
        }

        if (this.next8Bits() !== ID_HEADER[3]) {
            throw new VMError('Bad program! No Identifying Header found!');
        }
    }

    private consumeHeaderSection(): void {
        this._stackSize = this.next16Bits();

        this.next16Bits(); // padding

        // skip padding
        for (let i = 0; i < 52; i++) {
            this.next8Bits();
        }

        const headerLength = this.next8Bits();
        this.next8Bits(); // padding
        this.next16Bits();

        this.pc = headerLength;
    }

    private executeInstruction(): boolean {
        if (this.pc >= this.program.length) {
            throw new VMError(`PC out of bounds: ${this.pc}, while program length is ${this.program.length}. Maybe no HALT was encountered? Terminating!`);
        }

        if (this.forceStop) {
            this.forceStop = false;
            if (this.stopCallback) {
                this.stopCallback();
            }
            return true;
        }

        if (
            !this.ignoreNextBreakpoint
            && this.breakpoints.indexOf(this.pc) > -1
        ) {
            this.paused = true;
            return true;
        }

        this.paused = false;
        this.ignoreNextBreakpoint = false;

        const opcode = this.decodeOpcode();
        // this.log('-> opcode', opcode, this.program[this.pc], this.program[this.pc + 1], this.program[this.pc + 2]);

        switch (opcode) {
            case Opcode.HALT:
                this.next8Bits(); // padding
                this.next16Bits(); // padding

                this.log('HALT');

                if (this.stopCallback) {
                    this.stopCallback();
                }

                return true;

            case Opcode.LOAD:
                const LOAD_register = this.next8Bits();
                const LOAD_int16 = this.next16BitsSigned();

                this.log(
                    'LOAD',
                    '[', LOAD_register, ':', this.registers[LOAD_register], ']',
                    '[', LOAD_int16, ']'
                );

                this.registers[LOAD_register] = LOAD_int16;
                break;

            case Opcode.LOADA:
                const LOADA_register = this.next8Bits();
                const LOADA_address = this.next16Bits();

                this.log(
                    'LOADA',
                    '[', LOADA_register, ':', this.registers[LOADA_register], ']',
                    '[', LOADA_address, ':', this.memory.get(LOADA_address), ']'
                );

                this.registers[LOADA_register] = this.memory.get(LOADA_address);
                break;

            case Opcode.LOADAR:
                const LOADAR_register = this.next8Bits();
                const LOADAR_reg_addr = this.next8Bits();
                const LOADAR_offset = this.next8Bits();

                this.log(
                    'LOADAR',
                    '[', LOADAR_register, ':', this.registers[LOADAR_register], ']',
                    '[', LOADAR_reg_addr, ':', this.registers[LOADAR_reg_addr], ']',
                    '+', LOADAR_offset,
                    '=', this.memory.get(this.registers[LOADAR_reg_addr] + LOADAR_offset)
                );

                this.registers[LOADAR_register] = this.memory.get(this.registers[LOADAR_reg_addr] + LOADAR_offset);
                break;

            case Opcode.ADD:
                const ADD_register1 = this.next8Bits();
                const ADD_register2 = this.next8Bits();
                const ADD_register3 = this.next8Bits();

                const ADD_pre = this.registers[ADD_register1];
                this.registers[ADD_register1] = this.registers[ADD_register2] + this.registers[ADD_register3];

                this.log(
                    'ADD',
                    '[', ADD_register1, ':', ADD_pre, ']',
                    '[', ADD_register2, ':', this.registers[ADD_register2], ']',
                    '[', ADD_register3, ':', this.registers[ADD_register3], ']',
                    'res:', this.registers[ADD_register1]
                );
                break;

            case Opcode.ADDI:
                const ADDI_register1 = this.next8Bits();
                const ADDI_register2 = this.next8Bits();
                const ADDI_int8 = this.next8BitsSigned();

                const ADDI_pre = this.registers[ADDI_register1];
                this.registers[ADDI_register1] = ADDI_int8 + this.registers[ADDI_register2];

                this.log(
                    'ADDI',
                    '[', ADDI_register1, ':', ADDI_pre, ']',
                    '[', ADDI_register2, ':', this.registers[ADDI_register2], ']',
                    '[', ADDI_int8, ']',
                    'res:', this.registers[ADDI_register1]
                );
                break;

            case Opcode.INC:
                const INC_register = this.next8Bits();
                this.next16Bits(); // padding

                this.registers[INC_register] = this.registers[INC_register] + 1;

                this.log(
                    'INC',
                    '[', INC_register, ':', this.registers[INC_register], ']',
                    'res:', this.registers[INC_register]
                );
                break;

            case Opcode.SUB:
                const SUB_register1 = this.next8Bits();
                const SUB_register2 = this.next8Bits();
                const SUB_register3 = this.next8Bits();

                const SUB_pre = this.registers[SUB_register1];
                this.registers[SUB_register1] = this.registers[SUB_register2] - this.registers[SUB_register3];

                this.log(
                    'SUB',
                    '[', SUB_register1, ':', SUB_pre, ']',
                    '[', SUB_register2, ':', this.registers[SUB_register2], ']',
                    '[', SUB_register3, ':', this.registers[SUB_register3], ']',
                    'res:', this.registers[SUB_register1]
                );
                break;

            case Opcode.SUBI:
                const SUBI_register1 = this.next8Bits();
                const SUBI_register2 = this.next8Bits();
                const SUBI_int8 = this.next8BitsSigned();

                const SUBI_pre = this.registers[SUBI_register1];
                this.registers[SUBI_register1] = this.registers[SUBI_register2] - SUBI_int8;

                this.log(
                    'SUBI',
                    '[', SUBI_register1, ':', SUBI_pre, ']',
                    '[', SUBI_register2, ':', this.registers[SUBI_register2], ']',
                    '[', SUBI_int8, ']',
                    'res:', this.registers[SUBI_register1]
                );
                break;

            case Opcode.DEC:
                const DEC_register = this.next8Bits();
                this.next16Bits(); // padding

                this.registers[DEC_register] = this.registers[DEC_register] - 1;

                this.log(
                    'DEC',
                    '[', DEC_register, ':', this.registers[DEC_register], ']',
                    'res:', this.registers[DEC_register]
                );
                break;

            case Opcode.MUL:
                const MUL_register1 = this.next8Bits();
                const MUL_register2 = this.next8Bits();
                const MUL_register3 = this.next8Bits();

                const MUL_pre = this.registers[MUL_register1];
                this.registers[MUL_register1] = this.registers[MUL_register2] * this.registers[MUL_register3];

                this.log(
                    'MUL',
                    '[', MUL_register1, ':', MUL_pre, ']',
                    '[', MUL_register2, ':', this.registers[MUL_register2], ']',
                    '[', MUL_register3, ':', this.registers[MUL_register3], ']',
                    'res:', this.registers[MUL_register1]
                );
                break;

            case Opcode.MULI:
                const MULI_register1 = this.next8Bits();
                const MULI_register2 = this.next8Bits();
                const MULI_int8 = this.next8BitsSigned();

                const MULI_pre = this.registers[MULI_register1];
                this.registers[MULI_register1] = this.registers[MULI_register2] * MULI_int8;

                this.log(
                    'MULI',
                    '[', MULI_register1, ':', MULI_pre, ']',
                    '[', MULI_register2, ':', this.registers[MULI_register2], ']',
                    '[', MULI_int8, ']',
                    'res:', this.registers[MULI_register1]
                );
                break;

            case Opcode.DIV:
                const DIV_register1 = this.next8Bits();
                const DIV_register2 = this.next8Bits();
                const DIV_register3 = this.next8Bits();

                const DIV_pre = this.registers[DIV_register1];
                this.registers[DIV_register1] = Math.trunc(this.registers[DIV_register2] / this.registers[DIV_register3]);
                this.flags.remainder = this.registers[DIV_register2] % this.registers[DIV_register3];

                this.log(
                    'DIV',
                    '[', DIV_register1, ':', this.registers[DIV_pre], ']',
                    '[', DIV_register2, ':', this.registers[DIV_register2], ']',
                    '[', DIV_register3, ':', this.registers[DIV_register3], ']',
                    'res:', this.registers[DIV_register1],
                    'remainder:', this.flags.remainder
                );
                break;

            case Opcode.DIVI:
                const DIVI_register1 = this.next8Bits();
                const DIVI_register2 = this.next8Bits();
                const DIVI_int8 = this.next8BitsSigned();

                const DIVI_pre = this.registers[DIVI_register1];
                this.registers[DIVI_register1] = Math.trunc(this.registers[DIVI_register2] / DIVI_int8);
                this.flags.remainder = this.registers[DIVI_register2] % DIVI_int8;

                this.log(
                    'DIVI',
                    '[', DIVI_register1, ':', DIVI_pre, ']',
                    '[', DIVI_register2, ':', this.registers[DIVI_register2], ']',
                    '[', DIVI_int8, ']',
                    'res:', this.registers[DIVI_register1],
                    'remainder:', this.flags.remainder
                );
                break;

            case Opcode.JMP:
                const JMP_pos = this.next8Bits();
                this.next16Bits(); // padding

                this.pc = this.registers[JMP_pos];

                this.log(
                    'JMP',
                    '[', JMP_pos, ':', this.registers[JMP_pos], ']',
                    'pc:', this.pc
                );
                break;

            case Opcode.JMPF:
                const JMPF_offset = this.next8Bits();
                this.next16Bits(); // padding

                this.pc += this.registers[JMPF_offset];

                this.log(
                    'JMPF',
                    '[', JMPF_offset, ':', this.registers[JMPF_offset], ']',
                    'pc:', this.pc
                );
                break;

            case Opcode.JMPB:
                const JMPB_offset = this.next8Bits();
                this.next16Bits(); // padding

                this.pc -= this.registers[JMPB_offset];

                this.log(
                    'JMPB',
                    '[', JMPB_offset, ':', this.registers[JMPB_offset], ']',
                    'pc:', this.pc
                );
                break;

            case Opcode.CMP:
                const CMP_register1 = this.next8Bits();
                const CMP_register2 = this.next8Bits();
                this.next8Bits(); // padding

                const CMP_res = this.registers[CMP_register1] - this.registers[CMP_register2];
                this.flags.equal = CMP_res === 0;
                this.flags.negative = CMP_res < 0;

                this.log(
                    'CMP',
                    '[', CMP_register1, ':', this.registers[CMP_register1], ']',
                    '[', CMP_register2, ':', this.registers[CMP_register2], ']',
                    'equal:', this.flags.equal,
                    'negative:', this.flags.negative
                );
                break;

            case Opcode.CMPI:
                const CMPI_register1 = this.next8Bits();
                const CMPI_int16 = this.next16BitsSigned();

                const CMPI_res = this.registers[CMPI_register1] - CMPI_int16;
                this.flags.equal = CMPI_res === 0;
                this.flags.negative = CMPI_res < 0;

                this.log(
                    'CMPI',
                    '[', CMPI_register1, ':', this.registers[CMPI_register1], ']',
                    '[', CMPI_int16, ']',
                    'equal:', this.flags.equal,
                    'negative:', this.flags.negative
                );
                break;

            case Opcode.CMPN:
                const CMPN_register1 = this.next8Bits();
                const CMPN_register2 = this.next8Bits();
                this.next8Bits(); // padding

                const CMPN_res = this.registers[CMPN_register1] + this.registers[CMPN_register2];
                this.flags.equal = CMPN_res === 0;
                this.flags.negative = CMPN_res < 0;

                this.log(
                    'CMPN',
                    '[', CMPN_register1, ':', this.registers[CMPN_register1], ']',
                    '[', CMPN_register2, ':', this.registers[CMPN_register2], ']',
                    'equal:', this.flags.equal,
                    'negative:', this.flags.negative
                );
                break;

            case Opcode.CMPNI:
                const CMPNI_register1 = this.next8Bits();
                const CMPNI_int16 = this.next16BitsSigned();

                const CMPNI_res = this.registers[CMPNI_register1] + CMPNI_int16;
                this.flags.equal = CMPNI_res === 0;
                this.flags.negative = CMPNI_res < 0;

                this.log(
                    'CMPNI',
                    '[', CMPNI_register1, ':', this.registers[CMPNI_register1], ']',
                    '[', CMPNI_int16, ']',
                    'equal:', this.flags.equal,
                    'negative:', this.flags.negative
                );
                break;

            case Opcode.JEQ:
                const JEQ_pos = this.next8Bits();
                this.next16Bits(); // padding

                if (this.flags.equal) {
                    this.pc = this.registers[JEQ_pos];
                }

                this.log(
                    'JEQ',
                    '[', JEQ_pos, ':', this.registers[JEQ_pos], ']',
                    'equal:', this.flags.equal,
                    'pc:', this.pc
                );
                break;

            case Opcode.JNEQ:
                const JNEQ_pos = this.next8Bits();
                this.next16Bits(); // padding

                if (!this.flags.equal) {
                    this.pc = this.registers[JNEQ_pos];
                }

                this.log(
                    'JNEQ',
                    '[', JNEQ_pos, ':', this.registers[JNEQ_pos], ']',
                    'equal:', this.flags.equal,
                    'pc:', this.pc
                );
                break;

            case Opcode.JGT:
                const JGT_pos = this.next8Bits();
                this.next16Bits(); // padding

                if (!this.flags.equal && !this.flags.negative) {
                    this.pc = this.registers[JGT_pos];
                }

                this.log(
                    'JGT',
                    '[', JGT_pos, ':', this.registers[JGT_pos], ']',
                    'equal:', this.flags.equal,
                    'negative:', this.flags.negative,
                    'pc:', this.pc
                );
                break;

            case Opcode.JLT:
                const JLT_pos = this.next8Bits();
                this.next16Bits(); // padding

                if (!this.flags.equal && this.flags.negative) {
                    this.pc = this.registers[JLT_pos];
                }

                this.log(
                    'JLT',
                    '[', JLT_pos, ':', this.registers[JLT_pos], ']',
                    'equal:', this.flags.equal,
                    'negative:', this.flags.negative,
                    'pc:', this.pc
                );
                break;

            case Opcode.JGTE:
                const JGTE_pos = this.next8Bits();
                this.next16Bits(); // padding

                if (this.flags.equal || !this.flags.negative) {
                    this.pc = this.registers[JGTE_pos];
                }

                this.log(
                    'JGTE',
                    '[', JGTE_pos, ':', this.registers[JGTE_pos], ']',
                    'equal:', this.flags.equal,
                    'negative:', this.flags.negative,
                    'pc:', this.pc
                );
                break;

            case Opcode.JLTE:
                const JLTE_pos = this.next8Bits();
                this.next16Bits(); // padding

                if (this.flags.equal || this.flags.negative) {
                    this.pc = this.registers[JLTE_pos];
                }

                this.log(
                    'JLTE',
                    '[', JLTE_pos, ':', this.registers[JLTE_pos], ']',
                    'equal:', this.flags.equal,
                    'negative:', this.flags.negative,
                    'pc:', this.pc
                );
                break;

            case Opcode.JMPL:
                const JMPL_pos = this.next8Bits();
                this.next16Bits(); // padding

                this.pc = JMPL_pos;

                this.log(
                    'JMPL',
                    '[', JMPL_pos, ']',
                    'pc:', this.pc
                );
                break;

            case Opcode.JEQL:
                const JEQL_pos = this.next8Bits();
                this.next16Bits(); // padding

                if (this.flags.equal) {
                    this.pc = JEQL_pos;
                }

                this.log(
                    'JEQL',
                    '[', JEQL_pos, ']',
                    'equal:', this.flags.equal,
                    'pc:', this.pc
                );
                break;

            case Opcode.JNEQL:
                const JNEQL_pos = this.next8Bits();
                this.next16Bits(); // padding

                if (!this.flags.equal) {
                    this.pc = JNEQL_pos;
                }

                this.log(
                    'JNEQL',
                    '[', JNEQL_pos, ']',
                    'equal:', this.flags.equal,
                    'pc:', this.pc
                );
                break;

            case Opcode.JGTL:
                const JGTL_pos = this.next8Bits();
                this.next16Bits(); // padding

                if (!this.flags.equal && !this.flags.negative) {
                    this.pc = JGTL_pos;
                }

                this.log(
                    'JGTL',
                    '[', JGTL_pos, ']',
                    'equal:', this.flags.equal,
                    'negative:', this.flags.negative,
                    'pc:', this.pc
                );
                break;

            case Opcode.JLTL:
                const JLTL_pos = this.next8Bits();
                this.next16Bits(); // padding

                if (!this.flags.equal && this.flags.negative) {
                    this.pc = JLTL_pos;
                }

                this.log(
                    'JLTL',
                    '[', JLTL_pos, ']',
                    'equal:', this.flags.equal,
                    'negative:', this.flags.negative,
                    'pc:', this.pc
                );
                break;

            case Opcode.JGTEL:
                const JGTEL_pos = this.next8Bits();
                this.next16Bits(); // padding

                if (this.flags.equal || !this.flags.negative) {
                    this.pc = JGTEL_pos;
                }

                this.log(
                    'JGTEL',
                    '[', JGTEL_pos, ']',
                    'equal:', this.flags.equal,
                    'negative:', this.flags.negative,
                    'pc:', this.pc
                );
                break;

            case Opcode.JLTEL:
                const JLTEL_pos = this.next8Bits();
                this.next16Bits(); // padding

                if (this.flags.equal || this.flags.negative) {
                    this.pc = JLTEL_pos;
                }

                this.log(
                    'JLTEL',
                    '[', JLTEL_pos, ']',
                    'equal:', this.flags.equal,
                    'negative:', this.flags.negative,
                    'pc:', this.pc
                );
                break;

            case Opcode.PUTS:
                let PUTS_label_addr = this.next8Bits();
                this.next16Bits(); // padding

                const str = [];
                let char = this.program[PUTS_label_addr];

                while (char) {
                    str.push(char);
                    PUTS_label_addr += 1;
                    char = this.program[PUTS_label_addr];
                }
                str.push(0);
                this.outputBuffer = Uint8Array.from(str);

                this.log(
                    'PUTS',
                    '[', PUTS_label_addr, ':', str, ']'
                );
                break;

            case Opcode.SAVE:
                const SAVE_address = this.next16Bits();
                const SAVE_int8 = this.next8BitsSigned();

                this.memory.set(SAVE_address, SAVE_int8);

                this.log(
                    'SAVE',
                    '[', SAVE_address, ']',
                    '[', SAVE_int8, ']',
                );
                break;

            case Opcode.SAVETOR:
                const SAVETOR_reg = this.next8Bits();
                const SAVETOR_offset = this.next8Bits();
                const SAVETOR_int8 = this.next8BitsSigned();

                this.memory.set(this.registers[SAVETOR_reg] + SAVETOR_offset, SAVETOR_int8);

                this.log(
                    'SAVETOR',
                    '[', SAVETOR_reg, ':', this.registers[SAVETOR_reg], ']',
                    '+', SAVETOR_offset,
                    '[', SAVETOR_int8, ']',
                );
                break;

            case Opcode.SAVER:
                const SAVER_address = this.next16Bits();
                const SAVER_reg = this.next8Bits();

                this.memory.set(SAVER_address, this.registers[SAVER_reg]);

                this.log(
                    'SAVER',
                    '[', SAVER_address, ':', this.registers[SAVER_reg], ']',
                    '[', SAVER_reg, ']'
                );
                break;


            case Opcode.SAVERTOR:
                const SAVERTOR_to_reg = this.next8Bits();
                const SAVERTOR_offset = this.next8Bits();
                const SAVERTOR_reg = this.next8Bits();

                this.memory.set(this.registers[SAVERTOR_to_reg] + SAVERTOR_offset, this.registers[SAVERTOR_reg]);

                this.log(
                    'SAVERTOR',
                    '[', SAVERTOR_to_reg, ':', this.registers[SAVERTOR_to_reg], ']',
                    '+', SAVERTOR_offset,
                    '[', SAVERTOR_reg, ':', this.registers[SAVERTOR_reg], ']'
                );
                break;

            case Opcode.PUSH:
                const PUSH_reg = this.next8Bits();
                this.next16Bits(); // padding

                this.stackPush(this.registers[PUSH_reg]);

                this.log(
                    'PUSH',
                    '[', PUSH_reg, ':', this.registers[PUSH_reg], ']'
                );
                break;

            case Opcode.POP:
                const POP_reg = this.next8Bits();
                this.next16Bits(); // padding

                this.registers[POP_reg] = this.stackPop();

                this.log(
                    'POP',
                    '[', POP_reg, ':', this.registers[POP_reg], ']'
                );
                break;

            case Opcode.PUSHM:
                const PUSHM_regs = this.next24BitsAsReglist();

                for (let i = 0; i < PUSHM_regs.length; i++) {
                    this.stackPush(this.registers[PUSHM_regs[i]]);
                }

                this.log(
                    'PUSHM',
                    '[', PUSHM_regs.join(' '), ']'
                );

                break;

            case Opcode.POPM:
                const POPM_regs = this.next24BitsAsReglist();

                for (let i = 0; i < POPM_regs.length; i++) {
                    this.registers[POPM_regs[i]] = this.stackPop();
                }

                this.log(
                    'POPM',
                    '[', POPM_regs.join(' '), ']'
                );

                break;

            case Opcode.CALL:
                this.lr = this.pc + 3;

                const CALL_pos = this.next8Bits();
                this.next16Bits(); // padding
                this.pc = CALL_pos;

                this.log(
                    'CALL',
                    '[', CALL_pos, ']',
                    'pc:', this.pc
                );
                break;

            case Opcode.RET:
                const RET_pos = this.lr;
                this.next8Bits(); // padding
                this.next16Bits(); // padding

                this.pc = RET_pos;

                this.log(
                    'RET',
                    '[', RET_pos, ']'
                );
                break;

            case Opcode.MOV:
                const MOV_register1 = this.next8Bits();
                const MOV_register2 = this.next8Bits();
                this.next8Bits(); // padding

                const MOV_old_val = this.registers[MOV_register1];
                this.registers[MOV_register1] = this.registers[MOV_register2];

                this.log(
                    'MOV',
                    '[', MOV_register1, ':', MOV_old_val, ']',
                    '[', MOV_register2, ':', this.registers[MOV_register2], ']',
                    'res:',  this.registers[MOV_register1]
                );
                break;

            case Opcode.AND:
                const AND_register1 = this.next8Bits();
                const AND_register2 = this.next8Bits();
                this.next8Bits(); // padding

                const AND_old_val = this.registers[AND_register1];
                this.registers[AND_register1] = this.registers[AND_register1] & this.registers[AND_register2];

                this.log(
                    'AND',
                    '[', AND_register1, ':', AND_old_val, ']',
                    '[', AND_register2, ':', this.registers[AND_register2], ']',
                    'res:',  this.registers[AND_register1]
                );
                break;

            case Opcode.OR:
                const OR_register1 = this.next8Bits();
                const OR_register2 = this.next8Bits();
                this.next8Bits(); // padding

                const OR_old_val = this.registers[OR_register1];
                this.registers[OR_register1] = this.registers[OR_register1] | this.registers[OR_register2];

                this.log(
                    'OR',
                    '[', OR_register1, ':', OR_old_val, ']',
                    '[', OR_register2, ':', this.registers[OR_register2], ']',
                    'res:',  this.registers[OR_register1]
                );
                break;

            case Opcode.XOR:
                const XOR_register1 = this.next8Bits();
                const XOR_register2 = this.next8Bits();
                this.next8Bits(); // padding

                const XOR_old_val = this.registers[XOR_register1];
                this.registers[XOR_register1] = this.registers[XOR_register1] ^ this.registers[XOR_register2];

                this.log(
                    'XOR',
                    '[', XOR_register1, ':', XOR_old_val, ']',
                    '[', XOR_register2, ':', this.registers[XOR_register2], ']',
                    'res:',  this.registers[XOR_register1]
                );
                break;

            case Opcode.NOT:
                const NOT_register1 = this.next8Bits();
                this.next16Bits(); // padding

                const NOT_old_val = this.registers[NOT_register1];
                this.registers[NOT_register1] = ~ this.registers[NOT_register1];

                this.log(
                    'NOT',
                    '[', NOT_register1, ':', NOT_old_val, ']',
                    'res:',  this.registers[NOT_register1]
                );
                break;

            case Opcode.BIC:
                const BIC_register1 = this.next8Bits();
                const BIC_register2 = this.next8Bits();
                this.next8Bits(); // padding

                const BIC_old_val = this.registers[BIC_register1];
                this.registers[BIC_register1] = this.registers[BIC_register1] & (~ this.registers[BIC_register2]);

                this.log(
                    'BIC',
                    '[', BIC_register1, ':', BIC_old_val, ']',
                    '[', BIC_register2, ':', this.registers[BIC_register2], ']',
                    'res:',  this.registers[BIC_register1]
                );
                break;

            case Opcode.SHL:
                const SHL_register1 = this.next8Bits();
                const SHL_register2 = this.next8Bits();
                const SHL_register3 = this.next8Bits();

                const SHL_pre = this.registers[SHL_register1];
                this.registers[SHL_register1] = this.registers[SHL_register2] << this.registers[SHL_register3];

                this.log(
                    'SHL',
                    '[', SHL_register1, ':', SHL_pre, ']',
                    '[', SHL_register2, ':', this.registers[SHL_register2], ']',
                    '[', SHL_register3, ':', this.registers[SHL_register3], ']',
                    'res:', this.registers[SHL_register1]
                );
                break;

            case Opcode.SHLI:
                const SHLI_register1 = this.next8Bits();
                const SHLI_register2 = this.next8Bits();
                const SHLI_val = this.next8BitsSigned();

                const SHLI_pre = this.registers[SHLI_register1];
                this.registers[SHLI_register1] = this.registers[SHLI_register2] << SHLI_val;

                this.log(
                    'SHLI',
                    '[', SHLI_register1, ':', SHLI_pre, ']',
                    '[', SHLI_register2, ':', this.registers[SHLI_register2], ']',
                    '[', SHLI_val, ']',
                    'res:', this.registers[SHLI_register1]
                );
                break;

            case Opcode.SHR:
                const SHR_register1 = this.next8Bits();
                const SHR_register2 = this.next8Bits();
                const SHR_register3 = this.next8Bits();

                const SHR_pre = this.registers[SHR_register1];
                this.registers[SHR_register1] = this.registers[SHR_register2] >>> this.registers[SHR_register3];

                this.log(
                    'SHR',
                    '[', SHR_register1, ':', SHR_pre, ']',
                    '[', SHR_register2, ':', this.registers[SHR_register2], ']',
                    '[', SHR_register3, ':', this.registers[SHR_register3], ']',
                    'res:', this.registers[SHR_register1]
                );
                break;

            case Opcode.SHRI:
                const SHRI_register1 = this.next8Bits();
                const SHRI_register2 = this.next8Bits();
                const SHRI_val = this.next8BitsSigned();

                const SHRI_pre = this.registers[SHRI_register1];
                this.registers[SHRI_register1] = this.registers[SHRI_register2] >>> SHRI_val;

                this.log(
                    'SHRI',
                    '[', SHRI_register1, ':', SHRI_pre, ']',
                    '[', SHRI_register2, ':', this.registers[SHRI_register2], ']',
                    '[', SHRI_val, ']',
                    'res:', this.registers[SHRI_register1]
                );
                break;

            default:
                throw new VMError(`Unrecognized opcode [${opcode}] found! PC: ${this.pc} Terminating!`);
        }

        this.totalIterations += 1;

        this.callAfterInstructionRunCallback();

        return false;
    }

    private decodeOpcode(): Opcode {
        const opcode = this.program[this.pc];
        this.pc += 1;

        return opcode;
    }

    private next8Bits(): number {
        const result = this.program[this.pc];
        this.pc += 1;
        return result;
    }

    private next16Bits(): number {
        const result = ((this.program[this.pc]) << 8) | this.program[this.pc + 1];
        this.pc += 2;
        return result;
    }

    private next8BitsSigned(): number {
        return this.uintToInt(this.next8Bits(), 8);
    }

    private next16BitsSigned(): number {
        return this.uintToInt(this.next16Bits(), 16);
    }

    private next24Bits(): number {
        const result = ((this.program[this.pc]) << 16) | ((this.program[this.pc + 1]) << 8) | this.program[this.pc + 2];
        this.pc += 3;
        return result;
    }

    private next24BitsAsReglist(): number[] {
        const reglist: number[] = [];
        let map = this.next24Bits();

        const length = (map >>> 0) & 15;
        let i = 0;
        while (i < length) {
            reglist.push((map >>> 4) & 15);
            map = map >>> 4;
            i += 1;
        }

        reglist.reverse();

        return reglist;
    }

    private uintToInt(uint: number, bits: number): number {
        bits = +bits || 32;
        uint <<= 32 - bits;
        uint >>= 32 - bits;
        return uint;
    }

    private stackPush(value: number): void {
        if (this.sp <= VM.MEMORY_SIZE - this._stackSize) {
            throw new StackError(`Stack overflow! Max size is ${this._stackSize} bytes.`);
        }

        this.memory.set(this.sp - 3, (value >>> 24) & 255);
        this.memory.set(this.sp - 2, (value >>> 16) & 255);
        this.memory.set(this.sp - 1, (value >>> 8) & 255);
        this.memory.set(this.sp, value & 255);

        this.sp -= 4;
    }

    private stackPop(): number {
        if (this.sp >= VM.MEMORY_SIZE - 3) {
            throw new StackError('Stack underflow!');
        }

        this.sp += 4;

        return ((this.program[this.sp - 3]) << 24)
                | ((this.program[this.sp - 2]) << 16)
                | ((this.program[this.sp - 1]) << 8)
                | this.program[this.sp];
    }

    private callAfterInstructionRunCallback() {
        if (this.afterInstructionRunCallback) {
            this.afterInstructionRunCallback(this.totalIterations);
        }
    }

    private log(... args: any[]) {
        if (!this.debug) {
            return;
        }

        console.log(args.join(' '));
    }
}