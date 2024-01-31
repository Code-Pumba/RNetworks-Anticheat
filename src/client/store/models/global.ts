import { createModel } from '@rematch/core';
import type { RootModel } from './';
export type GlobalState = {
    disableAFK: boolean;
    blackout: boolean;
    blackoutLevel: number;
    blackoutOverride: boolean;
    halloween: string;
    rain: number;
    snow: boolean;
    streamUrls: {
        bennys: string;
        cinema: string;
    };
};


export const global = createModel<RootModel>()({
    state: {
        disableAFK: false,
        blackout: false,
        blackoutLevel: 0,
        blackoutOverride: false,
    } as GlobalState,
    reducers: {
        set(state, global: GlobalState) {
            return { ...state, ...global };
        },
    },
    effects: () => ({}),
});