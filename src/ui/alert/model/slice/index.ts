import { AlertState, Modal, Toast } from "../types/index.ts";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: AlertState = {
    toasts: [],
    modal: null
};

const alertSlice = createSlice({
    name: "alert",
    initialState,
    reducers: {
        openToast: (state, action: PayloadAction<Toast>) => {
            state.toasts.push(action.payload);
        },
        removeToast: (state, action: PayloadAction<string>) => {
            const index = state.toasts.findIndex(toast => toast.id === action.payload);
            if(index === -1) return;

            state.toasts.splice(index, 1); // módosítja in-place a tömböt
        },
        openModal: (state, action: PayloadAction<Modal>) => {
            state.modal = action.payload;
        },
        closeModal: (state, _) => {
            // if(state.modal?.dismissAction) state.modal.dismissAction();

            state.modal = null;
        }
    }
});

export const { openToast, removeToast, openModal, closeModal } = alertSlice.actions;

export const alertReducer = alertSlice.reducer;