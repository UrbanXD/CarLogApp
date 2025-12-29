import { ICON_NAMES } from "../../../constants/index.ts";
import { formTheme } from "../../../ui/form/constants/theme.ts";
import React from "react";
import IconButton from "../IconButton.tsx";

type InputAddMoreButtonProps = {
    onPress: () => void
}

export function InputAddMoreButton({ onPress }: InputAddMoreButtonProps) {
    return (
        <IconButton
            icon={ ICON_NAMES.add }
            iconSize={ formTheme.iconSize * 0.85 }
            onPress={ onPress }
            backgroundColor={ formTheme.containerBackgroundColor }
            iconColor={ formTheme.iconColor }
        />
    );
}