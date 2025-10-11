import { Control, UseFormReturn } from "react-hook-form";
import Input from "../Input.ts";
import { ICON_NAMES } from "../../../constants/index.ts";
import React from "react";

type NoteInputProps = {
    control: Control<any>
    setValue: UseFormReturn<any>["setValue"]
    fieldName: string
    title?: string
    subtitle?: string
    placeholder?: string
    optional?: boolean
}

export function NoteInput({
    control,
    setValue,
    fieldName,
    title = "Megjegyzés",
    subtitle,
    placeholder = title,
    optional = true
}: NoteInputProps) {
    return (
        <Input.Field
            control={ control }
            fieldName={ fieldName }
            fieldNameText={ title }
            fieldInfoText={ subtitle }
            optional={ optional }
        >
            <Input.Text
                icon={ ICON_NAMES.note }
                placeholder={ placeholder }
                multiline
                actionIcon={ ICON_NAMES.close }
                onAction={ () => setValue("note", "") }
            />
        </Input.Field>
    );
}