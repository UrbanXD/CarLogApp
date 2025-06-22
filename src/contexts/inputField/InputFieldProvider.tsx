import React, { ProviderProps } from "react";
import { ControllerRenderArgs } from "../../constants/index.ts";
import { InputFieldContext } from "./InputFieldContext.ts";

export const InputFieldProvider: React.FC<ProviderProps<ControllerRenderArgs>> = ({
    children,
    value
}) => {
    return (
        <InputFieldContext.Provider
            value={ value }
        >
            { children }
        </InputFieldContext.Provider>
    );
};