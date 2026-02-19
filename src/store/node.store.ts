import { PayloadAction } from '@reduxjs/toolkit'

import { checkExists } from '../utils/checkExists';
import { makeSlice } from '../utils/makeSlice';
import { NodeProps } from '../components/Node/Node';
import { CRITICAL_ARTICLE, RADICAL_WRITER, TAIL_ABOUT_CENT } from './localStore';


type NodeStore = {
    nodes: NodeProps[];
}

const nodeSlice = makeSlice<NodeStore>({
    name: 'node',
    initialState: {
        nodes: [
            {
                id: 'node-1',
                content: `${TAIL_ABOUT_CENT}`,
                docId: ['node-1', 'node-3'],
                className: '',
                style: { 
                    position: 'absolute', 
                    padding: '10px',
                    backgroundColor: '#fff',
                    border: '2px solid #007bff',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                },
            },
            {
                id: 'node-2',
                content: `${CRITICAL_ARTICLE}`,
                style: { 
                    position: 'absolute', 
                    padding: '10px',
                    backgroundColor: '#fff',
                    border: '2px solid #28a745',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }
            },
              {
                id: 'node-3',
                content: `${RADICAL_WRITER}`,
                style: { 
                     position: 'absolute', 
                    padding: '10px',
                    backgroundColor: '#fff',
                    border: '2px solid #ffc107',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }
            },
        ],
    },
    reducers: {
        setNodes(state: NodeStore, chains: PayloadAction<NodeProps[]>) {
            if (checkExists(state, 'nodes')) {
                state.nodes = chains.payload;
            }
        },
    },
})

export const {
    setNodes,
} = nodeSlice.actions

export type { NodeStore };
export default nodeSlice.reducer;
