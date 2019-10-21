import * as React from 'react';
import { findDOMNode } from 'react-dom';
import * as ace from 'brace';
import './ace-mode-tsasm';
import 'brace/theme/sqlserver';
import * as styles from './ASMEditor.scss';


const aceRange = ace.acequire('ace/range').Range;

interface IProps {
    readOnly: boolean;
    initialValue: string;
    onChange: (newValue: string) => void;
    onBreakpointsChage: (newValue: number[]) => void;
    highlightedLine: number | undefined;
    validBreakpoints: number[];
    breakpoints: number[];
    error?: {
        message: string,
        line: number,
        col: number
    };
}

export default class ASMEditor extends React.PureComponent<IProps, {}> {
    private editor: ace.Editor | undefined;
    private markerIds: number[] = [];

    render() {
        const { initialValue } = this.props;

        return (
           <div
               ref="editor"
               className={styles.ASMEditor}
           >
               {initialValue}
           </div>
        );
    }

    componentWillReceiveProps(nextProps: Readonly<IProps>): void {
        if (!this.editor) {
            return;
        }

        const session = this.editor.getSession();

        for (let i = 0; i < this.markerIds.length; i++) {
            session.removeMarker(this.markerIds[i]);
        }

        if (nextProps.highlightedLine) {
            this.markerIds.push(session.addMarker(
                new aceRange(nextProps.highlightedLine, 0, nextProps.highlightedLine, 1),
                'ace_active-line ' + styles.ASMEditorPCLine,
                'fullLine',
                false
            ));
        }

        session.clearBreakpoints();

        for (let i = 0; i < nextProps.breakpoints.length; i++) {
            session.setBreakpoint(nextProps.breakpoints[i], 'ace_breakpoint');
        }

        if (nextProps.readOnly != this.props.readOnly) {
            this.editor.setReadOnly(nextProps.readOnly);
        }

        if (nextProps.error !== this.props.error) {
            session.clearAnnotations();

            if (nextProps.error) {
                session.setAnnotations([{
                    row: nextProps.error.line || 0,
                    column: nextProps.error.col || 0,
                    type: 'error',
                    text: nextProps.error.message
                }]);
            }
        }
    }

    componentDidMount(): void {
        const { highlightedLine } = this.props;
        this.editor = ace.edit(findDOMNode(this.refs.editor) as HTMLElement);
        const session = this.editor.getSession();

        this.handleChange(session.getValue());
        session.on('change', () => {
            this.handleChange(session.getValue());
        });

        this.editor.setOptions({
            mode: 'ace/mode/tsasm',
            theme: 'ace/theme/sqlserver',
            fontSize: '16px',
            wrap: true,
            useSoftTabs: true,
            tabSize: 4,
            minLines: 24,
            maxLines: 24
        });

        if (highlightedLine) {
            this.markerIds.push(session.addMarker(
                new aceRange(highlightedLine, 0, highlightedLine, 1),
                'ace_active-line',
                'fullLine',
                false
            ));
        }

        this.editor.on('guttermousedown', (event) => {
            if (this.editor) {
                const target = event.domEvent.target;

                if (target.className.indexOf('ace_gutter-cell') < 0) {
                    return;
                }

                const row = event.getDocumentPosition().row;

                if (this.props.validBreakpoints.indexOf(row) < 0) {
                    return;
                }

                const breakpoints = event.editor.session.getBreakpoints(row, 0);

                if (typeof breakpoints[row] === typeof undefined) {
                    event.editor.session.setBreakpoint(row, 'ace_breakpoint');
                }
                else {
                    event.editor.session.clearBreakpoint(row);
                }

                const newBreakpoints = Object.keys(event.editor.session.getBreakpoints()).map(key => parseInt(key, 10));
                this.props.onBreakpointsChage(newBreakpoints);

                event.stop();
            }
        });
    }

    componentWillUnmount(): void {
        if (this.editor) {
            this.editor.destroy();
            this.editor.container.remove();
        }
    }

    private handleChange = (newValue: string): void => {
        this.props.onChange(newValue);
    };
}
