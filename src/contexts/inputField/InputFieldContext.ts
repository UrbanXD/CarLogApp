import { Context, createContext, useContext } from "react";
import { Control, UseControllerReturn } from "react-hook-form";

type InputFieldContextValue = (UseControllerReturn & { control: Control<any> }) | null;

export const InputFieldContext = createContext<InputFieldContextValue | null>(null);

export const useInputFieldContext = () =>
    useContext<InputFieldContextValue>(InputFieldContext as Context<InputFieldContextValue>);