import { configureStore } from '@reduxjs/toolkit';

import anchorsReducer, { setAnchor, setAnchorOffsets } from './anchor.store';
import chainReducer, { setChains } from './chain.store';
import nodeReducer, { setIsScroll, setNodes } from './node.store';
import tooltipReducer from './tooltip.store';


const store = configureStore({
    reducer: {
        anchors: anchorsReducer,
        chains: chainReducer,
        nodes: nodeReducer,
        tooltips: tooltipReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type StoreType = ReturnType<typeof store.getState>;
export { setAnchor, setAnchorOffsets, setChains, setIsScroll, setNodes }
export default store;