// User: rbonilla - pass: qwerty
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoadingTable: false,
  isLoading: false,
  pages: 1,
  rowsN: 10,
  selected: [],
  selectedObj: [],
};

export const uiSlice = createSlice({
  name: "ui",
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
    },
    setSelected: (state, action) => {
      console.log(action.payload, " Action pyaload of setSelected");
      state.selected = action.payload;
    },
    setSelectedObj: (state, action) => {
      state.selectedObj = action.payload;
    },
  },
});

export const {
  loadingTable,
  setPages,
  setRows,
  setLoading,
  setSelected,
  setSelectedObj,
} = uiSlice.actions;
