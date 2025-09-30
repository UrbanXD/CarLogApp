import React, { ReactNode } from "react";
import { InputFieldContext } from "./InputFieldContext.ts";
import { Control, UseControllerReturn } from "react-hook-form";

export type InputFieldProviderProps = {
    children: ReactNode
    value: UseControllerReturn & { control: Control<any> }
}

export function InputFieldProvider({
    children,
    value
}: InputFieldProviderProps) {
    return (
        <InputFieldContext.Provider value={ value }>
            { children }
        </InputFieldContext.Provider>
    );
}