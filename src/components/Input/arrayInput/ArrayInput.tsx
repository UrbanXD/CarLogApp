import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import Button from "../../Button/Button.ts";
import { SEPARATOR_SIZES } from "../../../constants/index.ts";
import { useInputFieldContext } from "../../../contexts/inputField/InputFieldContext.ts";
import { useFieldArray } from "react-hook-form";

type InputOptionalProps = {
    renderInput: (id: string, index: number) => ReactNode
    initialLength?: number;
    minLength?: number
    maxLength?: number
}

export function ArrayInput({
    renderInput,
    initialLength = 0,
    minLength = 1,
    maxLength = 1
}: InputOptionalProps) {
    const inputFieldContext = useInputFieldContext();
    if(!inputFieldContext) throw new Error("InputContext must be an input context");

    const { control, field } = inputFieldContext;

    if(minLength <= 0) throw new Error("MinLength must be greater than 0");
    if(initialLength < 0) initialLength = 0;
    if(minLength > maxLength) maxLength = minLength;

    const { fields, append, remove } = useFieldArray({
        name: field.name,
        control
    });

    useEffect(() => {
        console.log(fields);
    }, [fields]);

    const [currentFieldNumber, setCurrentFieldNumber] = useState<number>(initialLength);

    const isFull = useCallback(() => {
        return currentFieldNumber >= maxLength;
    }, [currentFieldNumber, maxLength]);

    const appendFieldNumber = useCallback(() => {
        console.log(isFull(), currentFieldNumber);
        if(isFull()) return;

        setCurrentFieldNumber(prevState => prevState + 1);
    });

    return (
        <View style={ { flexDirection: "column", alignItems: "flex-start", gap: SEPARATOR_SIZES.lightSmall } }>
            {
                <Button.InputAddMore onPress={ () => {} }/>
            }
            {
                fields.map((field, index) => (
                    <React.Fragment key={ field.id }>
                        { renderInput(field.id, index + 1) }
                    </React.Fragment>
                ))
            }
        </View>
    );


}