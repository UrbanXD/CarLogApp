import { AddToastFunction, OpenModalFunction } from "../types/index.ts";
import { Context, createContext, useContext } from "react";

type AlertContextValue = {
    addToast: AddToastFunction
    removeToast: (id: string) => void
    openModal: OpenModalFunction
    closeModal: () => void
}

export const AlertContext = createContext<AlertContextValue | null>(null);

export const useAlert = () => useContext<AlertContextValue>(AlertContext as Context<AlertContextValue>);