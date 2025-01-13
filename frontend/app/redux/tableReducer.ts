import { stat } from "fs";
import { Link } from "../models/link";

export interface TableState {
    entries: Link[];
    selectedEntries: Link[];
};

export const initialTableState: TableState = {
    entries: [],
    selectedEntries: []
};

export interface SelectTableEntry {
    type: 'selectTableEntry';
    entry: Link;
};

export interface UnselectTableEntry {
    type: 'unSelectTableEntry';
    entry: Link;
};

export interface SetTableEntries {
    type: 'setTableEntries';
    entries: Link[];
};

export interface SelectAllEntries {
    type: 'selectAllEntries';
}

export interface UnselectAllEntries {
    type: 'unselectAllEntries';
};

export type TableAction = SelectTableEntry | UnselectTableEntry | SetTableEntries | SelectAllEntries | UnselectAllEntries;

export const tableReducer = (state: TableState, action: TableAction): TableState => {
    if (action.type === 'selectTableEntry') {
        const isEntrySelected = state.selectedEntries
            .find(entry => entry.shortcode === action.entry.shortcode);

        if (!isEntrySelected) {
            return {
                ...state,
                selectedEntries: [...state.selectedEntries, action.entry]
            }
        }

        return state;
    }

    if (action.type === 'unSelectTableEntry') {
            const isEntrySelected = state.selectedEntries
                .find(entry => entry.shortcode === action.entry.shortcode);

            if (!isEntrySelected) {
                return state;
            }

            return {
                ...state,
                selectedEntries: state.selectedEntries.filter(entry => action.entry.shortcode !== entry.shortcode)
            }
    }

    if (action.type === 'setTableEntries') {
        return {
            ...state,
            entries: action.entries
        };
    }

    if (action.type === 'selectAllEntries') {
        return {
            ...state,
            selectedEntries: [...state.entries]
        }
    }

    if (action.type === 'unselectAllEntries') {
        return {
            ...state,
            selectedEntries: []
        }
    }

    return state;
};