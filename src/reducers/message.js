import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    message: {
        title: "",
        msg: "",
        success: false,
        error: false
    },
    isModalOpen: false
};

export const messageSlice = createSlice({
    name: "message",
    initialState,
    reducers: {
        setMessage: (state, action) => {
            state.message = {...action.payload}
        },
        setOpenModal: (state, action) => {
            state.isModalOpen = action.payload
        }
    }
});

export const {
    setMessage,
    setOpenModal
} = messageSlice.actions;