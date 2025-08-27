import { Context, createContext, useContext } from "react";
import { ControllerRenderArgs } from "../../constants/index.ts";

type InputFieldContextValue = ControllerRenderArgs | null;

export const InputFieldContext = createContext<InputFieldContextValue | null>(null);

export const useInputFieldContext = () =>
    useContext<InputFieldContextValue>(InputFieldContext as Context<InputFieldContextValue>);