import { configureStore } from '@reduxjs/toolkit';

import anchorsReducer, { setAnchor, setAnchorOffsets } from './anchor.store';
import chainReducer, { setChains } from './chain.store';
import nodeReducer, { setNodes } from './node.store';

const store = configureStore({
    reducer: {
        anchors: anchorsReducer,
        chains: chainReducer,
        nodes: nodeReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type StoreType = ReturnType<typeof store.getState>;
export { setAnchor, setAnchorOffsets, setChains, setNodes }
export default store;