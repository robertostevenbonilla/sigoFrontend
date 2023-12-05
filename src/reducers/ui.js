import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isLoadingTable: false,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    loadingTable: (state, action) => {
      state.isLoadingTable = action.payload;
    },
}
});

export const {
    loadingTable
} = uiSlice.actions;