import { PayloadAction } from '@reduxjs/toolkit'

import { checkExists } from '../utils/checkExists';
import { makeSlice } from '../utils/makeSlice';

type AnchorStore = {
    anchor:string;
    anchorOffset: Record<string, DOMRect>;
    anchorRelation: Record<string, string[]>;
}

const chainSlice = makeSlice<AnchorStore>({
    name: 'anchor',
    initialState: {
        anchor: '',
        anchorOffset: {},
        anchorRelation: {
            'chain-1': ['node-1', 'node-2'],
            'chain-2': ['node-2', 'node-3'],
            'chain-3': ['node-2', 'node-3'],
            'chain-4': ['node-2', 'node-3'],
        },
    },
    reducers: {

        setAnchor(state, anchors: PayloadAction<string>) {
            if (checkExists(state, 'anchor')) {
                state.anchor = anchors.payload;
            }
        },

        setAnchorOffsets(state, anchor: PayloadAction<Record<string, DOMRect>>) {
            const [[_, key], [__, value]] = Object.entries(anchor.payload);
            state.anchorOffset[`${key}`] = value;
        },

        setAnchorRelation(state, anchor: PayloadAction<Record<string, string[]>>) {
            const [[_, key], [__, value]] = Object.entries(anchor.payload);
    
            state.anchorRelation[`${key}`] = value;
        },
        
    },
})

export const {
    setAnchor,
    setAnchorOffsets,
    setAnchorRelation,
} = chainSlice.actions

export type { AnchorStore };
export default chainSlice.reducer;
