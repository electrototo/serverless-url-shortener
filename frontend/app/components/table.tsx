import React, { ReactNode, useRef, useState } from "react";
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

export function Table<T>(props: TableProps<T>) {
    const [ selectAll, setSelectAll ] = useState<boolean>(false);
    const selectAllRef = useRef<HTMLInputElement>(null);

    const toggleAllHandler = () => {
        setSelectAll(!selectAll);
    };

    return (
        <BootstrapTable style={{ maxWidth: '100%', tableLayout: 'fixed' }} striped={props.striped}>
            <thead>
                <tr>
                    <th style={{ width: '2rem' }}>
                        <input type="checkbox" ref={selectAllRef} checked={selectAll} onClick={toggleAllHandler} />
                    </th>
                    {
                        props.columns.map(colDef => {
                            return (
                                <th>
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
                        return (
                            <tr>
                                <td style={{ width: '2rem' }}>
                                    <input type="checkbox" />
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