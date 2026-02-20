import { makeSlice } from '../utils/makeSlice';

type TooltipStore = {
    tooltips?: Record<string, { content: string, tooltip: string }>;
}

const tooltipSlice = makeSlice<TooltipStore>({
    name: 'tooltip',
    initialState: {
        tooltips: { 'comment-1': { tooltip: 'Позднее он нелегально перебирается в Италию в связи с угрозой экстрадиции.', content: 'К слову на этом его мытарства не закончились' }},
    },
    reducers: {
    },
});

// export const {} = tooltipSlice.actions;

export type { TooltipStore };
export default tooltipSlice.reducer;