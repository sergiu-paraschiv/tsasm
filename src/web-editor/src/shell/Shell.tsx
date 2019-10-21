import * as React from 'react';
import ASMEditor from '../editor/ASMEditor';
import { VM } from '../../../vm/VM';
import { Assembler, IDebugData } from '../../../assembler/Assembler';
import { ParserError } from '../../../assembler/ParserError';


const INITIAL_VALUE = `
.asciiz '----------'
DONE: .asciiz 'Done.'

        LOAD $1 50 ; a comment
        LOAD $2 10 ; another comment
        LOAD $10 0
        LOAD $11 0
        LOAD $12 1

;
; this comment 
; is on multiple lines :)
; and contains START SUB $1 ADD CMP
;
        
START:  SUB  $1 $1 $2
        ADD  $11 $11 $12
        CMP  $1 $10
        
        PUSH $1
        
        JEQ  END
        JMP  START
        
END:    PUTS DONE
        HALT
.asciiz '----------'
`;

interface IState {
    code: string
    breakpoints: number[]
    running: boolean
    crtPc: number | undefined
    iterations: number | undefined
    validBreakpoints: number[]
    error?: ParserError;
    outputBuffer: Uint8Array;
    memoryViewSpan: [ number, number ];
}

export default class Shell extends React.PureComponent<{}, IState> {
    private crtVM: VM | undefined;
    private debugData: IDebugData | undefined;

    constructor(props: {}) {
        super(props);

        this.state = {
            code: '',
            breakpoints: [],
            running: false,
            crtPc: undefined,
            iterations: undefined,
            validBreakpoints: [],
            error: undefined,
            outputBuffer: new Uint8Array(),
            memoryViewSpan: [64, 100]
        };
    }

    render() {
        const { running, crtPc, breakpoints, validBreakpoints, error, outputBuffer, memoryViewSpan } = this.state;

        let ob = '';
        outputBuffer.forEach(charCode => ob += String.fromCharCode(charCode));

        let memory = '';
        if (this.crtVM) {
            let o = 0;
            for (let i = memoryViewSpan[0]; i <= memoryViewSpan[1]; i++) {
                if (!(o % 4)) {
                    memory += '\n' + i + ': ';
                }
                memory += this.crtVM.memory.get(i) + ' ';

                o += 1;
            }
        }

        let stack = '';
        if (this.crtVM) {
            for (let i = VM.MEMORY_SIZE - 3; i > this.crtVM.registers[13]; i -= 4) {
                stack += this.crtVM.memory.get(i - 3).toString() + ' ';
                stack += this.crtVM.memory.get(i - 2).toString() + ' ';
                stack += this.crtVM.memory.get(i - 1).toString() + ' ';
                stack += this.crtVM.memory.get(i - 0).toString() + '\n';
            }
        }

        return (
            <div>
                <ASMEditor
                    initialValue={INITIAL_VALUE}
                    onChange={this.handleCodeChange}
                    breakpoints={breakpoints}
                    onBreakpointsChage={this.handleBreakpointsChange}
                    validBreakpoints={validBreakpoints}
                    highlightedLine={crtPc && this.debugData ? this.debugData.lineMap.indexOf(crtPc) : undefined}
                    readOnly={running}
                    error={error && this.debugData ? {
                        message: error.message,
                        line: (error.line || 1) - 1,
                        col: error.col || 0
                    } : undefined}
                />

                <button onClick={this.handleClickRun} disabled={running}>Run</button>
                <button onClick={this.handleClickContinue} disabled={!running || (this.crtVM && !this.crtVM.isPaused())}>Continue</button>
                <button onClick={this.handleClickStop} disabled={!running}>Stop</button>

                {(this.debugData && this.crtVM) ? (
                    <div className="shell_watch">
                        <div>
                            <strong>PC:</strong> {crtPc}
                        </div>
                        <div><strong>Flags</strong></div>
                        <div>remainder: {this.crtVM!.flags.remainder}</div>
                        <div>equal: {this.crtVM!.flags.equal ? 'true' : 'false'}</div>
                        <div>negative: {this.crtVM!.flags.negative ? 'true' : 'false'}</div>
                        <div><strong>Registers</strong></div>
                        {this.debugData.usedRegisters.map(reg => (
                            <div key={reg}>${reg}: {this.crtVM!.registers[reg]}</div>
                        ))}
                        <div><strong>Labels</strong></div>
                        {Object.keys(this.debugData.labels).map(name => (
                            <div key={name}>{name}: {this.debugData!.labels[name]}</div>
                        ))}

                        <div><strong>Output</strong></div>
                        <textarea
                            readOnly={true}
                            value={ob}
                        />

                        <div><strong>Memory</strong></div>
                        <div>
                            <input type="number" value={memoryViewSpan[0]}
                                   onChange={e => this.setState({ memoryViewSpan: [parseInt(e.target.value, 10), memoryViewSpan[1]] })} />
                            -
                            <input type="number" value={memoryViewSpan[1]}
                                   onChange={e => this.setState({ memoryViewSpan: [memoryViewSpan[0], parseInt(e.target.value, 10)] })} />
                        </div>
                        <textarea
                            style={{ width: '400px', height: '300px' }}
                            readOnly={true}
                            value={memory}
                        />

                        <div><strong>Stack</strong></div>
                        <textarea
                            style={{ width: '400px', height: '300px' }}
                            readOnly={true}
                            value={stack}
                        />
                    </div>
                ) : null}

            </div>
        );
    }

    private handleCodeChange = (code: string) => {
        const assembler = new Assembler();
        const validBreakpoints: number[] = [];

        try {
            const data = assembler.run(code, true);
            this.debugData = data.debugData;
            let breakpoints = this.state.breakpoints;

            if (this.debugData) {
                for (let i = 0; i < this.debugData.lineMap.length; i++) {
                    if (this.debugData.lineMap[i] != null) {
                        validBreakpoints.push(i);
                    }
                }
            }

            breakpoints = breakpoints.filter(line => validBreakpoints.indexOf(line) > -1);

            this.setState({
                code,
                validBreakpoints,
                breakpoints,
                error: undefined
            });
        }
        catch (error) {
            if (error instanceof ParserError) {
                // we'll pass the error to state
            }
            else {
                throw error;
            }

            this.setState({
                code,
                validBreakpoints: [],
                breakpoints: [],
                error
            });
        }
    };

    private handleBreakpointsChange = (breakpoints: number[]) => {
        this.setState({ breakpoints }, () => {
            this.setVMBreakpoints();
        });
    };

    private handleClickRun = () => {
        this.setState({
            running: true
        }, () => {
            const assembler = new Assembler();

            this.crtVM = new VM();
            this.crtVM.debug = true;

            const data = assembler.run(this.state.code, true);
            this.crtVM.program = data.program;
            this.debugData = data.debugData;

            this.setVMBreakpoints();

            this.crtVM.onPcChange((crtPc: number, iterations: number) => {
                this.setState({
                    crtPc,
                    iterations
                });
            });

            this.crtVM.onOutputBufferChange(() => {
                if (!this.crtVM) {
                    return;
                }

                this.setState({
                    outputBuffer: this.crtVM.outputBuffer
                });
            });

            this.crtVM.onStop(() => {
                this.setState({
                    running: false,
                    crtPc: undefined
                }, () => {
                    this.crtVM = undefined;
                });
            });

            this.crtVM.run();
        });
    };

    private handleClickContinue = () => {
        if (this.crtVM) {
            this.crtVM.continue();
        }
    };

    private handleClickStop = () => {
        if (this.crtVM) {
            this.crtVM.stop();
        }
    };

    private setVMBreakpoints() {
        if (this.crtVM && this.debugData) {
            const pcPoints = this.state.breakpoints.map(line => this.debugData!.lineMap[line]);
            this.crtVM.setBreakpoints(pcPoints.filter(point => point != null) as number[]);
        }
    }
}