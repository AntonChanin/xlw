import { PayloadAction } from '@reduxjs/toolkit'

import { checkExists } from '../utils/checkExists';
import { makeSlice } from '../utils/makeSlice';
import { ChainProps } from '../components/Chain/Chain';
import { ColorGenerator } from '../classes/ColorGenerator';

type ChainStore = {
    anchorOffset: Record<string, DOMRect>;
    chains: ChainProps[];
    relaitionType?: Record<string, 'dashed' | 'stroke' | 'dot'>;
}


const generator = new ColorGenerator();

const colors = new Array(50).fill('').map(() => generator.generateUniqueContrastColor());

const chainSlice = makeSlice<ChainStore>({
    name: 'chain',
    initialState: {
        chains: [
            {
                id: 'chain-1',
                from: { nodeId: 'node-1', docId: 'node-1' },
                to: { nodeId: 'node-2', docId: 'node-2' },
                color: colors[0],
            },
            {
                id: 'chain-2',
                from: { nodeId: 'node-3', docId: 'node-3' },
                to: { nodeId: 'node-2', docId: 'node-2' },
                color: colors[1],
            },
            {
                id: 'chain-3',
                from: { nodeId: 'node-3', docId: 'node-3' },
                to: { nodeId: 'node-2', docId: 'node-2' },
                color: colors[2],
            },
            {
                id: 'chain-4',
                from: { nodeId: 'node-3', docId: 'node-3' },
                to: { nodeId: 'node-2', docId: 'node-2' },
                color: colors[3],
            },
            {
                id: 'chain-5',
                from: { nodeId: 'node-1', docId: 'node-1' },
                to: { nodeId: 'node-2', docId: 'node-2' },
                color: colors[4],
            },
            {
                id: 'chain-6',
                from: { nodeId: 'node-1', docId: 'node-1' },
                to: { nodeId: 'node-2', docId: 'node-2' },
                color: colors[5],
            },
            {
                id: 'chain-7',
                from: { nodeId: 'node-2', docId: 'node-2' },
                to: { nodeId: 'node-3', docId: 'node-3' },
                color: colors[6],
            },
            {
                id: 'chain-8',
                from: { nodeId: 'node-2', docId: 'node-2' },
                to: { nodeId: 'node-3', docId: 'node-3' },
                color: colors[7],
            },
            {
                id: 'chain-9',
                from: { nodeId: 'node-3', docId: 'node-3' },
                to: { nodeId: 'node-4', docId: 'node-4' },
                color: colors[8],
            },
        ],
        relaitionType: { 'chain-1': 'stroke', 'chain-2': 'dashed', 'chain-3': 'dashed', 'chain-4': 'dashed', 'chain-5': 'dashed',  'chain-6': 'stroke', 'chain-7': 'stroke', 'chain-8': 'stroke', 'chain-9': 'dashed' },
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
} = chainSlice.actions;

export type { ChainStore };
export default chainSlice.reducer;
