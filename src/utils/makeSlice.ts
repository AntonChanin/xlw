import { createSlice, CreateSliceOptions, SliceCaseReducers, SliceSelectors } from '@reduxjs/toolkit';

function makeSlice<T>(options: CreateSliceOptions<T, SliceCaseReducers<T>, string, string, SliceSelectors<T>>) {
    return createSlice<T, SliceCaseReducers<T>, string, SliceSelectors<T>, string>(options);
}

export { makeSlice };