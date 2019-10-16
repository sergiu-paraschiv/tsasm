import * as React from 'react';
import ASMEditor from '../editor/ASMEditor';
import { VM } from '../../../vm/VM';
import { Assembler, IDebugData } from '../../../assembler/Assembler';
import { ParserError } from '../../../assembler/ParserError';


const INITIAL_VALUE = `
.asciiz 'foo'
BAR: .asciiz 'bar'

        LOAD $1 50
        LOAD $2 10
        LOAD $10 0
        LOAD $11 0
        LOAD $12 1
        
        
START:  SUB  $1 $2 $1
        ADD  $11 $12 $11
        CMP  $1 $10
        
        JEQ  END
        JMP  START
        
        
END:    HALT

`;

interface IState {
    code: string
    breakpoints: number[]
    running: boolean
    crtPc: number | undefined
    iterations: number | undefined
    validBreakpoints: number[]
    error?: ParserError;
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
            error: undefined
        };
    }

    render() {
        const { running, crtPc, breakpoints, validBreakpoints, error } = this.state;

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
                    <div className="ace_editor">
                        <div><strong>PC:</strong> {crtPc}</div>
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