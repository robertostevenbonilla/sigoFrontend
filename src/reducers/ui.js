import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isLoadingTable: false,
    isLoading: false,
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
    setLoading: (state, action) => {
      state.isLoading = action.payload;
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
    setRows,
    setLoading
} = uiSlice.actions;