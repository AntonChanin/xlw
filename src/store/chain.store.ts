import { PayloadAction } from '@reduxjs/toolkit'

import { checkExists } from '../utils/checkExists';
import { makeSlice } from '../utils/makeSlice';
import { ChainProps } from '../components/Chain/Chain';

type ChainStore = {
    chains: ChainProps[];
    anchorOffset: Record<string, DOMRect>;
}

const chainSlice = makeSlice<ChainStore>({
    name: 'chain',
    initialState: {
        chains: [
            {
                id: 'chain-1',
                from: { nodeId: 'node-1', docId: 'node-1' },
                to: { nodeId: 'node-2', docId: 'node-2' },
                color: '#007bff',
            },
            {
                id: 'chain-2',
                from: { nodeId: 'node-3', docId: 'node-3' },
                to: { nodeId: 'node-2', docId: 'node-2' },
                color: '#28a745',
            },
            {
                id: 'chain-3',
                from: { nodeId: 'node-3', docId: 'node-3' },
                to: { nodeId: 'node-2', docId: 'node-2' },
                color: '#ffc107',
            },
                 {
                id: 'chain-4',
                from: { nodeId: 'node-3', docId: 'node-3' },
                to: { nodeId: 'node-2', docId: 'node-2' },
                color: '#ff07b5',
            },
        ],
        anchorOffset: { },
    },
    reducers: {

        setChains(state, chains: PayloadAction<ChainProps[]>) {
            if (checkExists(state, 'chains')) {
                state.chains = chains.payload;
            }
        },

        setAnchorOffsets(state, anchor: PayloadAction<Record<string, DOMRect>>) {
            const [[_, key], [__, value]] = Object.entries(anchor.payload);
            console.log({ key, value }, JSON.stringify(state.anchorOffset))
            state.anchorOffset[`${key}`] = value;
        },
        
    },
})

export const {
    setChains,
    setAnchorOffsets,
} = chainSlice.actions

export type { ChainStore };
export default chainSlice.reducer;
