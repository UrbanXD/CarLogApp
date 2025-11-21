import Button from "../Button.ts";
import { ICON_NAMES, SEPARATOR_SIZES } from "../../../constants/index.ts";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

type FormButtonsProps = {
    submit: () => Promise<void>
    reset?: UseFormReturn<any>["reset"]
    submitText?: string
}

export function FormButtons({
    submit,
    reset,
    submitText
}: FormButtonsProps) {
    const { t } = useTranslation();

    return (
        <Button.Row
            style={ { paddingTop: SEPARATOR_SIZES.lightSmall, justifyContent: !reset ? "flex-end" : "space-between" } }>
            {
                reset &&
               <Button.Icon
                  icon={ ICON_NAMES.reset }
                  onPress={ () => reset() }
               />
            }
            <Button.Text
                text={ submitText ?? t("form_button.save") }
                onPress={ submit }
                style={ { flex: reset ? 1 : 0.8 } }
                loadingIndicator
            />
        </Button.Row>
    );
}