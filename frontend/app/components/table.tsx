import React, { act, ReactNode, useEffect, useReducer, useRef, useState } from "react";
import { Table as BootstrapTable } from 'react-bootstrap';

interface ColumnDefinition <T>{
    selector: keyof T;
    displayName: string;
    render?: (element: T) => React.ReactElement | string; 
}

export interface TableProps<T> {
    columns: ColumnDefinition<T>[];
    data: T[];
    onSelect: (selectedData: T[]) => void;
    striped?: boolean;
}

interface TableState<T> {
    entries: T[];
    selectedEntries: T[];
}

type SelectEntry<T> = {
    type: 'selectEntry',
    entry: T
};

type RemoveEntry<T> = {
    type: 'removeEntry',
    entry: T
};

type SelectAllEntries = {
    type: 'selectAllEntries',
};

type RemoveAllEntries = {
    type: 'removeAllEntries'
};

type TableActions<T> = SelectEntry<T> | RemoveEntry<T> | SelectAllEntries | RemoveAllEntries;

function tableReducer<T>(state: TableState<T>, action: TableActions<T>): TableState<T> {
    if (action.type === 'selectEntry') {
        const alreadySelected = state.selectedEntries
            .find(entry => action.entry === entry) !== undefined;

        if (alreadySelected) {
            return state;
        }

        return {
            ...state,
            selectedEntries: [...state.selectedEntries, action.entry]
        }
    }

    if (action.type === 'removeEntry') {
        const filtered = state.selectedEntries
            .filter(entry => action.entry !== entry);

        return {
            ...state,
            selectedEntries: filtered
        }
    }

    if (action.type === 'selectAllEntries') {
        return {
            ...state,
            selectedEntries: [...state.entries]
        }
    }

    if (action.type === 'removeAllEntries') {
        return {
            ...state,
            selectedEntries: []
        }
    }

    return state;
}

export function Table<T>(props: TableProps<T>) {
    const [ selectAll, setSelectAll ] = useState<boolean>(false);
    const selectAllRef = useRef<HTMLInputElement>(null);

    const [ state, dispatch ] = useReducer(tableReducer<T>, {
        entries: props.data,
        selectedEntries: []
    } as TableState<T>);

    const toggleAllHandler = () => {
        setSelectAll(!selectAll);
    };

    useEffect(() => {
        if (selectAll) {
            dispatch({ type: 'selectAllEntries' });
        } else {
            dispatch({ type: 'removeAllEntries' });
        }
    }, [selectAll]);

    useEffect(() => {
        props.onSelect(state.selectedEntries);

        if (!selectAllRef.current) {
            return;
        }

        if (state.selectedEntries.length > 0)  {
            if (state.selectedEntries.length === state.entries.length) {
                selectAllRef.current.indeterminate = false
            } else {
                selectAllRef.current.indeterminate = true
            }
        } else {
            selectAllRef.current.indeterminate = false
        }
    }, [state]);

    return (
        <BootstrapTable style={{ maxWidth: '100%', tableLayout: 'fixed' }} striped={props.striped}>
            <thead>
                <tr>
                    <th style={{ width: '2rem' }}>
                        <input type="checkbox"
                            ref={selectAllRef}
                            checked={selectAll}
                            onClick={toggleAllHandler} />
                    </th>
                    {
                        props.columns.map(colDef => {
                            return (
                                <th key={colDef.displayName}>
                                    { colDef.displayName }
                                </th>
                            );
                        })
                    }
                </tr>
            </thead>
            <tbody>
                {
                    props.data.map(entry => {
                        const isSelected = state.selectedEntries.find(stateEntry => stateEntry === entry) !== undefined;

                        return (
                            <tr className={ isSelected ? 'active' : ''}>
                                <td style={{ width: '2rem' }}>
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => {
                                            if (!isSelected) {
                                                dispatch({
                                                    type: 'selectEntry',
                                                    entry: entry
                                                });
                                            } else {
                                                dispatch({
                                                    type: 'removeEntry',
                                                    entry: entry
                                                });
                                            }
                                        }}/>
                                </td>
                                { props.columns.map(colDef => {
                                    return (
                                        <td style={{ wordWrap: 'break-word' }}>
                                            {
                                                colDef.render !== undefined
                                                    ? colDef.render(entry)
                                                    : entry[colDef.selector] as ReactNode
                                            }
                                        </td>
                                    );
                                }) }
                            </tr>
                        );
                    })
                }
            </tbody>
        </BootstrapTable>
    );
};