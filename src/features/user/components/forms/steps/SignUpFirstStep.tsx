import React from "react";
import Input from "../../../../../components/Input/Input.ts";
import { COLORS, GLOBAL_STYLE, ICON_NAMES } from "../../../../../constants/index.ts";
import Button from "../../../../../components/Button/Button.ts";
import TextDivider from "../../../../../components/TextDivider.tsx";
import { useMultiStepForm } from "../../../../../contexts/multiStepForm/MultiStepFormContext.ts";
import { EmailStep } from "./EmailStep.tsx";
import { StepProps } from "../../../../../types/index.ts";

export const SignUpFirstStep: React.FC<StepProps> = ({
    control
}) => {
    const { next } = useMultiStepForm();

    return (
        <Input.Group>
            <EmailStep control={ control }/>
            <Button.Text
                text="Következő"
                iconRight={ ICON_NAMES.rightArrowHead }
                onPress={ next }
            />
            <TextDivider
                title="vagy"
                color={ COLORS.gray1 }
                lineHeight={ 1 }
                marginVertical={ GLOBAL_STYLE.formContainer.gap }
            />
            <Button.Google/>
        </Input.Group>
    );
};