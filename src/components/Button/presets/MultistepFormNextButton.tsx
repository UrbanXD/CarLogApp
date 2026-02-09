import React from "react";
import TextButton from "../TextButton";
import { ICON_NAMES } from "../../../constants/index.ts";

interface MultistepFormNextButtonProps {
    isLastStep?: boolean;
    onPress: () => void;
}

export const MultistepFormNextButton: React.FC<MultistepFormNextButtonProps> = ({
    onPress,
    isLastStep
}) => {
    return (
        <TextButton
            text={ !isLastStep ? "multistep_form.go_to_next_step" : "multistep_form.submit_multistep_form" }
            iconRight={ !isLastStep ? ICON_NAMES.rightArrowHead : undefined }
            loadingIndicator
            onPress={ onPress }
        />
    );
};