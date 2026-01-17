import { Control, UseFormReturn } from "react-hook-form";
import Input from "../Input.ts";
import { ICON_NAMES } from "../../../constants/index.ts";
import React from "react";
import { useTranslation } from "react-i18next";

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
    title,
    subtitle,
    placeholder = title,
    optional = true
}: NoteInputProps) {
    const { t } = useTranslation();

    return (
        <Input.Field
            control={ control }
            fieldName={ fieldName }
            fieldNameText={ title ?? t("common.note") }
            fieldInfoText={ subtitle }
            optional={ optional }
        >
            <Input.Text
                icon={ ICON_NAMES.note }
                placeholder={ placeholder ?? t("common.note") }
                multiline
                actionIcon={ ICON_NAMES.close }
                onAction={ () => setValue("note", null) }
            />
        </Input.Field>
    );
}