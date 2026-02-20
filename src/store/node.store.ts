import { PayloadAction } from '@reduxjs/toolkit'

import { checkExists } from '../utils/checkExists';
import { makeSlice } from '../utils/makeSlice';
import { NodeProps } from '../components/Node';
import { CRITICAL_ARTICLE, MOROZOV_NIKOLAI_ALEKSANDROVICH_STORIES_OF_MY_LIFE_VOLUME_1, RADICAL_WRITER, TAIL_ABOUT_CENT } from './localStore';


type NodeStore = {
    nodes: NodeProps[];
    isScroll: boolean;
}

const nodeSlice = makeSlice<NodeStore>({
    name: 'node',
    initialState: {
        nodes: [
            {
                id: 'node-1',
                content: `${TAIL_ABOUT_CENT}`,
                className: '',
                style: { 
                    position: 'absolute', 
                    padding: '10px',
                    backgroundColor: '#fff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1), 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)'
                },
            },
            {
                id: 'node-2',
                content: `${CRITICAL_ARTICLE}`,
                style: { 
                    position: 'absolute', 
                    padding: '10px',
                    backgroundColor: '#fff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1), 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)'
                }
            },
            {
                id: 'node-3',
                content: `${RADICAL_WRITER}`,
                style: { 
                    position: 'absolute', 
                    padding: '10px',
                    backgroundColor: '#fff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1), 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)'
                }
            },
            {
                id: 'node-4',
                content: `${MOROZOV_NIKOLAI_ALEKSANDROVICH_STORIES_OF_MY_LIFE_VOLUME_1}`,
                style: { 
                    position: 'absolute', 
                    padding: '10px',
                    backgroundColor: '#fff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1), 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)'
                }
            },
        ],
        isScroll: false,
    },
    reducers: {
        setNodes(state: NodeStore, chains: PayloadAction<NodeProps[]>) {
            if (checkExists(state, 'nodes')) {
                state.nodes = chains.payload;
            }
        },
        setIsScroll(state: NodeStore, isScroll: PayloadAction<boolean>) {
            if (checkExists(state, 'isScroll')) {
                state.isScroll = isScroll.payload;
            }
        },
    },
})

export const {
    setNodes,
    setIsScroll,
} = nodeSlice.actions;

export type { NodeStore };
export default nodeSlice.reducer;
