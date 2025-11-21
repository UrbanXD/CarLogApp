import Button from "../Button.ts";
import { ICON_NAMES, SEPARATOR_SIZES } from "../../../constants/index.ts";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import i18n from "../../../i18n/index.ts";

type FormButtonsProps = {
    submit: () => Promise<void>
    reset?: UseFormReturn<any>["reset"]
    submitText?: string
}

export function FormButtons({
    submit,
    reset,
    submitText = i18n.t("form_button.save")
}: FormButtonsProps) {
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
                text={ submitText }
                onPress={ submit }
                style={ { flex: reset ? 1 : 0.8 } }
                loadingIndicator
            />
        </Button.Row>
    );
}