import Input from "../Input.ts";
import { ICON_NAMES } from "../../../constants/index.ts";
import React from "react";
import { Control } from "react-hook-form";
import { useTranslation } from "react-i18next";

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
    placeholder
}: AddItemToDropdownInputProps) {
    const { t } = useTranslation();

    return (
        <Input.Field control={ control } fieldName={ fieldName }>
            <Input.Text
                placeholder={ placeholder ?? t("form.picker.new_item") }
                actionIcon={ ICON_NAMES.check }
                onAction={ submitHandler }
            />
        </Input.Field>
    );
}