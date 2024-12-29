import React from "react";
import TextButton from "../components/TextButton";
import {ICON_NAMES} from "../../Shared/constants/constants";

interface MultistepFormNextButtonProps {
    isLastStep?: boolean
    onPress: () => void
}

const MultistepFormNextButton: React.FC<MultistepFormNextButtonProps> = ({
    onPress,
    isLastStep
}) =>
    <TextButton
        text={ !isLastStep ? "Következő" : "Befejezés" }
        iconRight={ !isLastStep ? ICON_NAMES.rightArrowHead : undefined }
        onPress={ onPress }
    />

export default MultistepFormNextButton;