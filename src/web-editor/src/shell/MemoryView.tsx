import * as React from 'react';
import { VariableSizeList as List, ListChildComponentProps } from 'react-window';

interface IProps {
    getRow: (row: number) => React.ReactNode;
    rowCount: number;
    reverseAddress: (address: number) => number;
}

const Cell = ({ data, index, style }: ListChildComponentProps) => (
    <div style={style}>
        {data(index)}
    </div>
);

const listRef = React.createRef() as any;

export const MemoryView = (props: IProps) => {
    const [ address, setAddress ] = React.useState('');

    return (
        <div className="Window MemoryView">
            <div className="WindowHeader">Memory</div>
            <List
                ref={listRef}
                className="MemoryViewBody"
                itemCount={props.rowCount}
                itemSize={() => 24}
                height={350}
                width={'100%'}
                itemData={props.getRow}
            >
                {Cell}
            </List>

            <div className="WindowFooter">
                <div className="input-group" style={{ width: '300px', padding: '15px' }}>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Address"
                        value={address}
                        onChange={event => setAddress(event.target.value)}
                    />
                    <div className="input-group-append">
                        <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() => {
                                if (listRef && listRef.current) {
                                    let index = props.reverseAddress(parseInt(address, 10));
                                    if (index > props.rowCount) {
                                        index = props.rowCount;
                                    }

                                    listRef.current.scrollToItem(index);
                                }
                            }}
                        >
                            View
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};