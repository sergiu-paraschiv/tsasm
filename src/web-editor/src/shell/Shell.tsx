import * as React from 'react';
import { Play, Square, SkipForward } from 'react-feather';
import { VM } from '../../../vm/VM';
import { Assembler, IDebugData } from '../../../assembler/Assembler';
import { ParserError } from '../../../assembler/ParserError';
import ASMEditor from '../editor/ASMEditor';
import { MemoryView } from './MemoryView';
import { StackView } from './StackView';
import { INIT_PROGRAM } from './INIT_PROGRAM';


interface IState {
    code: string
    breakpoints: number[]
    running: boolean
    iterations: number | undefined
    validBreakpoints: number[]
    error?: ParserError;
    memoryViewSpan: [ number, number ];
    debugData: IDebugData | undefined;
}

export default class Shell extends React.PureComponent<{}, IState> {
    private readonly vm: VM;
    private static readonly BYTES_PER_MEMORY_VIEW_LINE = 16;

    constructor(props: {}) {
        super(props);

        this.vm = new VM();

        this.vm.afterInstructionRun((iterations: number) => {
            this.setState({
                iterations
            });
        });

        this.vm.onStop(() => {
            this.setState({
                running: false
            });
        });

        const debugData = this.runAssembler(INIT_PROGRAM, true);

        this.state = {
            code: INIT_PROGRAM,
            breakpoints: [],
            running: false,
            iterations: undefined,
            validBreakpoints: [],
            error: undefined,
            memoryViewSpan: [64, 100],
            debugData
        };
    }

    render() {
        return (
            <div className="container mt-3">
                {this.renderRunControls()}

                <div className="row">
                    <div className="col-8">
                        {this.renderEditor()}

                        <div className="mt-3">
                            {this.renderMemoryView()}
                        </div>
                    </div>

                    <div className="col-4">
                        {this.renderDebugInfo()}
                    </div>
                </div>
            </div>
        );
    }

    private renderEditor() {
        const { running, breakpoints, validBreakpoints } = this.state;

        return (
            <ASMEditor
                initialValue={INIT_PROGRAM}
                onChange={this.handleCodeChange}
                breakpoints={breakpoints}
                onBreakpointsChage={this.handleBreakpointsChange}
                validBreakpoints={validBreakpoints}
                highlightedLine={this.getCurrentHighlightedLine()}
                readOnly={running}
                error={this.getCurrentErrorLine()}
            />
        );
    }

    private renderRunControls() {
        const { running } = this.state;

        return (
            <div className="row justify-content-start mb-3">
                <div className="col-auto">
                    <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={this.handleClickRun}
                        disabled={running}
                    >
                        Run
                        <Play color="#28a745" size={14} />
                    </button>
                </div>


                {running ? (
                    <div className="col-auto">
                        <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={this.handleClickContinue}
                            disabled={!this.vm.isPaused()}
                        >
                            Continue
                            <SkipForward color="#ffc107" size={14} />
                        </button>
                    </div>
                ) : null}

                {running ? (
                    <div className="col-auto">
                        <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={this.handleClickStop}
                        >
                            Stop
                            <Square color="#dc3545" size={14} />
                        </button>
                    </div>
                ) : null}
            </div>
        );
    }

    private renderMemoryView() {
        return (
            <MemoryView
                getRow={this.getMemoryViewRow}
                rowCount={(this.vm.memory.size / Shell.BYTES_PER_MEMORY_VIEW_LINE) + 1}
                reverseAddress={index => Math.floor(index / Shell.BYTES_PER_MEMORY_VIEW_LINE)}
            />
        );
    }

    private renderDebugInfo() {
        const { debugData } = this.state;

        if (!debugData) {
            return null;
        }

        const ob = this.getOutputBuffer();

        return (
            <div className="">
                <div>
                    <strong>SP:</strong> {this.vm.registers[13]}
                    &nbsp;
                    <strong>LR:</strong> {this.vm.registers[14]}
                    &nbsp;
                    <strong>PC:</strong> {this.vm.registers[15]}
                </div>

                <div><strong>Flags</strong></div>
                <div>remainder: {this.vm.flags.remainder}</div>
                <div>equal: {this.vm.flags.equal ? 'true' : 'false'}</div>
                <div>negative: {this.vm.flags.negative ? 'true' : 'false'}</div>

                <div><strong>Registers</strong></div>
                {debugData.usedRegisters.map(reg => (
                    <div key={reg}>${reg}: {this.vm.registers[reg]}</div>
                ))}
                <div><strong>Labels</strong></div>
                {Object.keys(debugData.labels).map(name => (
                    <div key={name}>{name}: {debugData.labels[name]}</div>
                ))}

                <div><strong>Output</strong></div>
                <textarea
                    readOnly={true}
                    value={ob}
                />

                <StackView
                    getRow={this.getStackViewRow}
                    rowCount={(this.vm.stackSize / 4) + 1}
                    reverseAddress={index => Math.floor((VM.MEMORY_SIZE - 3 - index) / 4)}
                />
            </div>
        );
    }

    private handleCodeChange = (code: string) => {
        this.setState({
            code,
            error: undefined
        }, () => {
            this.runAssembler(code);
        });
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
            this.vm.reset();
            this.vm.debug = true;

            this.runAssembler(this.state.code);

            this.setVMBreakpoints();

            this.vm.run();
        });
    };

    private handleClickContinue = () => {
        if (this.state.running) {
            this.vm.continue();
        }
    };

    private handleClickStop = () => {
        if (this.state.running) {
            this.vm.stop();
        }
    };

    private runAssembler(code: string, returnDebugData = false) {
        try {
            const assembler = new Assembler();
            const data = assembler.run(code, true);
            this.vm.program = data.program;

            if (!returnDebugData) {
                this.setState({
                    debugData: data.debugData
                }, () => {
                    this.updateBreakpoints();
                });
            }
            else {
                return data.debugData;
            }
        }
        catch (error) {
            if (error instanceof ParserError) {
                // we'll pass the error to state
            }
            else {
                throw error;
            }

            this.setState({
                validBreakpoints: [],
                breakpoints: [],
                error
            });
        }

        return undefined;
    }

    private updateBreakpoints() {
        const { debugData } = this.state;
        const validBreakpoints: number[] = [];
        let breakpoints = this.state.breakpoints;

        if (debugData) {
            console.log('x', debugData.lineMap);

            for (let i = 0; i < debugData.lineMap.length; i++) {
                if (debugData.lineMap[i] != null) {
                    validBreakpoints.push(i);
                }
            }
        }

        breakpoints = breakpoints.filter(line => validBreakpoints.indexOf(line) > -1);

        this.setState({
            validBreakpoints,
            breakpoints
        });
    }

    private setVMBreakpoints() {
        const { debugData } = this.state;

        if (!debugData) {
            return;
        }

        const { breakpoints } = this.state;
        const pcPoints = breakpoints.map(line => debugData.lineMap[line]);
        this.vm.setBreakpoints(pcPoints.filter(point => point != null) as number[]);
    }

    private getCurrentHighlightedLine(): number | undefined {
        const { debugData } = this.state;

        if (!debugData) {
            return undefined;
        }

        const pc = this.vm.registers[15];
        return debugData.lineMap.indexOf(pc) || undefined;
    }

    private getCurrentErrorLine(): {
        message: string,
        line: number,
        col: number
    } | undefined
    {
        const { error, debugData } = this.state;

        if (!debugData || !error) {
            return undefined;
        }

        return {
            message: error.message,
            line: (error.line || 1) - 1,
            col: error.col || 0
        };
    }

    private getOutputBuffer(): string {
        let ob = '';

        this.vm.outputBuffer.forEach(charCode => ob += String.fromCharCode(charCode));

        return ob;
    }

    private getMemoryViewRow = (row: number): React.ReactNode => {
        const line: React.ReactNode[] = [
            <span key="id">{row * Shell.BYTES_PER_MEMORY_VIEW_LINE}</span>
        ];
        const index = row *  Shell.BYTES_PER_MEMORY_VIEW_LINE;
        let endIndex = index + Shell.BYTES_PER_MEMORY_VIEW_LINE;

        if (endIndex > this.vm.memory.size) {
            endIndex = this.vm.memory.size;
        }

        for (let i = index; i < endIndex; i++) {
            line.push(<span key={i}>{this.vm.memory.get(i)}</span>);
        }

        return line;
    };

    private getStackViewRow = (row: number): React.ReactNode => {
        /*
        0   ... 0
        row ... x + VM.MEMORY_SIZE - 3
        END ... - this.vm.stackSize
        */

        const index = ((row * -this.vm.stackSize) / (this.vm.stackSize / 4)) + VM.MEMORY_SIZE - 3;
        let endIndex = index - 4;

        if (endIndex < VM.MEMORY_SIZE - 3 - this.vm.stackSize) {
            endIndex = VM.MEMORY_SIZE - 3 - this.vm.stackSize;
        }

        const line: React.ReactNode[] = [
            <span key="id">{index}</span>
        ];

        for (let i = index; i > endIndex; i--) {
            line.push(<span key={i}>{this.vm.memory.get(i)}</span>);
        }

        return line;
    }
}