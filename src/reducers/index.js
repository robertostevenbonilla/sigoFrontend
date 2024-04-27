import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from "./auth";
import { messageSlice } from "./message";
import { uiSlice } from "./ui";
import { filtroSlice } from "./filtro";

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        message: messageSlice.reducer,
        ui: uiSlice.reducer,
        filtro: filtroSlice.reducer,
    }
});