import Input from "../Input.ts";
import { ICON_NAMES } from "../../../constants/index.ts";
import React from "react";
import { Control } from "react-hook-form";

type AddItemToDropdownInputProps = {
    control: Control<any>
    submitHandler: (e?: React.BaseSyntheticEvent) => Promise<void>
    fieldName: string
    placeholder?: string
}

export function AddItemToDropdownInput({
    control,
    submitHandler,
    fieldName,
    placeholder = "Új elem"
}: AddItemToDropdownInputProps) {
    return (
        <Input.Field control={ control } fieldName={ fieldName }>
            <Input.Text
                placeholder={ placeholder }
                actionIcon={ ICON_NAMES.check }
                onAction={ submitHandler }
            />
        </Input.Field>
    );
}