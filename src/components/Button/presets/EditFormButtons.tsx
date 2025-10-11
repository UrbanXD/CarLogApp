import Button from "../Button.ts";
import { ICON_NAMES, SEPARATOR_SIZES } from "../../../constants/index.ts";
import React from "react";
import { UseFormReturn } from "react-hook-form";

type EditFormButtonsProps = {
    reset: UseFormReturn<any>["reset"]
    submit: () => Promise<void>
    submitText?: string
}

export function EditFormButtons({ reset, submit, submitText = "Mentés" }: EditFormButtonsProps) {
    return (
        <Button.Row style={ { paddingTop: SEPARATOR_SIZES.lightSmall } }>
            <Button.Icon
                icon={ ICON_NAMES.reset }
                onPress={ () => reset() }
            />
            <Button.Text
                text={ submitText }
                onPress={ submit }
                style={ { flex: 0.85 } }
                loadingIndicator
            />
        </Button.Row>
    );
}