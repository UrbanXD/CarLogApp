import { Control, UseFormReturn } from "react-hook-form";
import Input from "../Input.ts";
import { ICON_NAMES } from "../../../constants/index.ts";
import React from "react";
import i18n from "../../../i18n/index.ts";

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
    title = i18n.t("common.note"),
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
                onAction={ () => setValue("note", null) }
            />
        </Input.Field>
    );
}