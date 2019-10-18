import { ID_HEADER, Opcode } from '../Instruction';
import { VMError } from './VMError';
import { Memory } from './Memory';


export class VM {
    public debug: boolean;

    public registers: Uint16Array;
    public pc: number;
    public program: Uint8Array;
    public flags: {
        remainder: number;
        equal: boolean;
        negative: boolean;
    };
    public totalIterations: number;
    public outputBuffer: Uint8Array;
    public memory: Memory;

    private breakpoints: number[];
    private ignoreNextBreakpoint: boolean;
    private paused: boolean;
    private stopCallback: undefined | (() => void);
    private forceStop: boolean;
    private pcChangeCallback: undefined | ((pc: number, iterations: number) => void);
    private outputBufferChange: undefined | (() => void);

    constructor() {
        this.debug = false;

        this.registers = new Uint16Array(16);
        this.pc = 0;
        this.program = new Uint8Array();
        this.flags = {
            remainder: 0,
            equal: false,
            negative: false
        };
        this.totalIterations = 0;
        this.outputBuffer = new Uint8Array();
        this.memory = new Memory(256 * 256 * 256);

        this.breakpoints = [];
        this.ignoreNextBreakpoint = false;
        this.paused = false;
        this.forceStop = false;
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
        if (this.pcChangeCallback) {
            this.pcChangeCallback(this.pc, this.totalIterations);
        }
        this.executeInstruction();
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

    public onPcChange(callback: (pc: number, iterations: number) => void) {
        this.pcChangeCallback = callback;
    }

    public onOutputBufferChange(callback: () => void) {
        this.outputBufferChange = callback;
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
        const headerLength = this.next8Bits();
        this.next8Bits(); // padding
        this.next16Bits();

        this.pc = headerLength;
    }

    private executeInstruction(): boolean {
        if (this.pc >= this.program.length) {
            throw new VMError(`PC out of bounds: ${this.pc}, while program length is ${this.program.length}. Maybe no HALT was encountered? Terminating!`);
        }

        if (this.pcChangeCallback) {
            this.pcChangeCallback(this.pc, this.totalIterations);
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
        this.log('-> opcode', opcode, this.program[this.pc], this.program[this.pc + 1], this.program[this.pc + 2]);

        switch (opcode) {
            case Opcode.HALT:
                this.next8Bits(); // padding
                this.next16Bits(); // padding

                if (this.stopCallback) {
                    this.stopCallback();
                }

                return true;

            case Opcode.LOAD:
                const LOAD_register = this.next8Bits();
                const LOAD_double = this.next16Bits();

                this.registers[LOAD_register] = LOAD_double;

                this.log('LOAD', LOAD_register, LOAD_double);
                break;

            case Opcode.LOADA:
                const LOADA_register = this.next8Bits();
                const LOADA_address = this.next16Bits();

                this.registers[LOADA_register] = this.memory.get(LOADA_address);
                break;

            case Opcode.LOADAR:
                const LOADAR_register = this.next8Bits();
                const LOADAR_reg_addr = this.next8Bits();
                this.next8Bits();

                this.registers[LOADAR_register] = this.memory.get(this.getOffsettedMemoryAddress(LOADAR_reg_addr));

                this.log('LOADAR', LOADAR_register, LOADAR_reg_addr, this.registers[LOADAR_register], this.registers[LOADAR_reg_addr], this.memory.get(this.getOffsettedMemoryAddress(LOADAR_reg_addr)));
                break;

            case Opcode.ADD:
                const ADD_register1 = this.next8Bits();
                const ADD_register2 = this.next8Bits();
                const ADD_register3 = this.next8Bits();

                this.registers[ADD_register3] = this.registers[ADD_register1] + this.registers[ADD_register2];

                this.log('ADD', ADD_register1, this.registers[ADD_register1], ADD_register2, this.registers[ADD_register2], ADD_register3, this.registers[ADD_register3]);
                break;

            case Opcode.SUB:
                const SUB_register1 = this.next8Bits();
                const SUB_register2 = this.next8Bits();
                const SUB_register3 = this.next8Bits();

                this.registers[SUB_register3] = this.registers[SUB_register1] - this.registers[SUB_register2];
                break;

            case Opcode.MUL:
                const MUL_register1 = this.next8Bits();
                const MUL_register2 = this.next8Bits();
                const MUL_register3 = this.next8Bits();

                this.registers[MUL_register3] = this.registers[MUL_register1] * this.registers[MUL_register2];
                break;

            case Opcode.DIV:
                const DIV_register1 = this.next8Bits();
                const DIV_register2 = this.next8Bits();
                const DIV_register3 = this.next8Bits();

                this.registers[DIV_register3] = Math.trunc(this.registers[DIV_register1] / this.registers[DIV_register2]);
                this.flags.remainder = this.registers[DIV_register1] % this.registers[DIV_register2];
                break;

            case Opcode.JMP:
                const JMP_pos = this.next8Bits();
                this.next16Bits(); // padding

                this.pc = this.registers[JMP_pos];
                break;

            case Opcode.JMPF:
                const JMPF_offset = this.next8Bits();
                this.next16Bits(); // padding

                this.pc += this.registers[JMPF_offset];
                break;

            case Opcode.JMPB:
                const JMPB_offset = this.next8Bits();
                this.next16Bits(); // padding

                this.pc -= this.registers[JMPB_offset];
                break;

            case Opcode.CMP:
                const EQ_register1 = this.next8Bits();
                const EQ_register2 = this.next8Bits();
                this.next8Bits(); // padding

                const res = this.registers[EQ_register1] - this.registers[EQ_register2];

                this.flags.equal = res === 0;
                this.flags.negative = res < 0;
                break;

            case Opcode.JEQ:
                const JEQ_pos = this.next8Bits();
                this.next16Bits(); // padding

                if (this.flags.equal) {
                    this.pc = this.registers[JEQ_pos];
                }
                break;

            case Opcode.JNEQ:
                const JNEQ_pos = this.next8Bits();
                this.next16Bits(); // padding

                if (!this.flags.equal) {
                    this.pc = this.registers[JNEQ_pos];
                }
                break;

            case Opcode.JGT:
                const JGT_pos = this.next8Bits();
                this.next16Bits(); // padding

                if (!this.flags.equal && !this.flags.negative) {
                    this.pc = this.registers[JGT_pos];
                }
                break;

            case Opcode.JLT:
                const JLT_pos = this.next8Bits();
                this.next16Bits(); // padding

                if (!this.flags.equal && this.flags.negative) {
                    this.pc = this.registers[JLT_pos];
                }
                break;

            case Opcode.JGTE:
                const JGTE_pos = this.next8Bits();
                this.next16Bits(); // padding

                if (this.flags.equal || !this.flags.negative) {
                    this.pc = this.registers[JGTE_pos];
                }
                break;

            case Opcode.JLTE:
                const JLTE_pos = this.next8Bits();
                this.next16Bits(); // padding

                if (this.flags.equal || this.flags.negative) {
                    this.pc = this.registers[JLTE_pos];
                }
                break;

            case Opcode.JMPL:
                const JMPL_pos = this.next8Bits();
                this.next16Bits(); // padding

                this.pc = JMPL_pos;
                break;

            case Opcode.JEQL:
                const JEQL_pos = this.next8Bits();
                this.next16Bits(); // padding

                if (this.flags.equal) {
                    this.pc = JEQL_pos;
                }
                break;

            case Opcode.JNEQL:
                const JNEQL_pos = this.next8Bits();
                this.next16Bits(); // padding

                if (!this.flags.equal) {
                    this.pc = JNEQL_pos;
                }
                break;

            case Opcode.JGTL:
                const JGTL_pos = this.next8Bits();
                this.next16Bits(); // padding

                if (!this.flags.equal && !this.flags.negative) {
                    this.pc = JGTL_pos;
                }
                break;

            case Opcode.JLTL:
                const JLTL_pos = this.next8Bits();
                this.next16Bits(); // padding

                if (!this.flags.equal && this.flags.negative) {
                    this.pc = JLTL_pos;
                }
                break;

            case Opcode.JGTEL:
                const JGTEL_pos = this.next8Bits();
                this.next16Bits(); // padding

                if (this.flags.equal || !this.flags.negative) {
                    this.pc = JGTEL_pos;
                }
                break;

            case Opcode.JLTEL:
                const JLTEL_pos = this.next8Bits();
                this.next16Bits(); // padding

                if (this.flags.equal || this.flags.negative) {
                    this.pc = JLTEL_pos;
                }
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

                if (this.outputBufferChange) {
                    this.outputBufferChange();
                }
                break;

            case Opcode.SAVE:
                const SAVE_address = this.next16Bits();
                const SAVE_int = this.next8Bits();

                this.memory.set(SAVE_address, SAVE_int);
                break;

            case Opcode.SAVETOR:
                const SAVETOR_reg = this.next8Bits();
                const SAVETOR_int = this.next8Bits();
                this.next8Bits(); // padding

                this.log('SAVETOR', SAVETOR_reg, this.memory.size, this.getOffsettedMemoryAddress(SAVETOR_reg), SAVETOR_int);
                this.memory.set(this.getOffsettedMemoryAddress(SAVETOR_reg), SAVETOR_int);

                break;

            case Opcode.SAVER:
                const SAVER_address = this.next16Bits();
                const SAVER_reg = this.next8Bits();

                this.memory.set(SAVER_address, this.registers[SAVER_reg]);
                break;


            case Opcode.SAVERTOR:
                const SAVERTOR_to_reg = this.next8Bits();
                const SAVERTOR_reg = this.next8Bits();
                this.next8Bits(); // padding

                this.memory.set(this.getOffsettedMemoryAddress(SAVERTOR_to_reg), this.registers[SAVERTOR_reg]);

                this.log('SAVERTOR', SAVERTOR_to_reg, this.getOffsettedMemoryAddress(SAVERTOR_to_reg), SAVERTOR_reg, this.registers[SAVERTOR_reg]);
                break;

            default:
                throw new VMError(`Unrecognized opcode [${opcode}] found! PC: ${this.pc} Terminating!`);
        }

        this.totalIterations += 1;

        return false;
    }

    private getOffsettedMemoryAddress(reg: number) {
        this.log('[', reg, this.registers[reg], ']');
        return this.registers[reg];
    }

    private decodeOpcode(): Opcode {
        const opcode = this.program[this.pc];
        this.pc += 1;

        return opcode;
    }

    private next8Bits(): number {
        let result = this.program[this.pc];
        this.pc += 1;
        return result;
    }

    private next16Bits(): number {
        let result = ((this.program[this.pc]) << 8) | this.program[this.pc + 1];
        this.pc += 2;
        return result;
    }

    private log(... args: any[]) {
        if (!this.debug) {
            return;
        }

        console.log(args);
    }
}