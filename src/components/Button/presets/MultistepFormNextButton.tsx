import React from "react";
import TextButton from "../TextButton";
import { ICON_NAMES } from "../../../constants/constants";

interface MultistepFormNextButtonProps {
    isLastStep?: boolean
    onPress: () => void
}

export const MultistepFormNextButton: React.FC<MultistepFormNextButtonProps> = ({
    onPress,
    isLastStep
}) =>
    <TextButton
        text={ !isLastStep ? "Következő" : "Befejezés" }
        iconRight={ !isLastStep ? ICON_NAMES.rightArrowHead : undefined }
        loadingIndicator
        onPress={ onPress }
    />