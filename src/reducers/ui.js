import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isLoadingTable: false,
    pages: 1,
    rows: 10,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    loadingTable: (state, action) => {
      state.isLoadingTable = action.payload;
    },
    setPages: (state, action) => {
      state.pages = action.payload;
    },
    setRows: (state, action) => {
      state.rows = action.payload;
    }
}
});

export const {
    loadingTable,
    setPages,
    setRows
} = uiSlice.actions;