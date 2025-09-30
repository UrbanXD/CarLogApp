import { ICON_NAMES } from "../../../constants/index.ts";
import { formTheme } from "../../../ui/form/constants/theme.ts";
import Button from "../Button.ts";
import React from "react";

type InputAddMoreButtonProps = {
    onPress: () => void
}

export function InputAddMoreButton({ onPress }: InputAddMoreButtonProps) {
    return (
        <Button.Icon
            icon={ ICON_NAMES.add }
            iconSize={ formTheme.iconSize * 0.85 }
            onPress={ onPress }
            backgroundColor={ formTheme.containerBackgroundColor }
            iconColor={ formTheme.iconColor }
        />
    );
}