import React from "react";
import Input from "../../../../../components/Input/Input.ts";
import { COLORS, GLOBAL_STYLE } from "../../../../../constants/index.ts";
import Button from "../../../../../components/Button/Button.ts";
import TextDivider from "../../../../../components/TextDivider.tsx";
import { useMultiStepForm } from "../../../../../contexts/multiStepForm/MultiStepFormContext.ts";
import { EmailStep } from "./EmailStep.tsx";
import { StepProps } from "../../../../../types/index.ts";
import { useTranslation } from "react-i18next";

export const SignUpFirstStep: React.FC<StepProps> = (props) => {
    const { next } = useMultiStepForm();
    const { t } = useTranslation();

    return (
        <Input.Group>
            <EmailStep { ...props }/>
            <Button.MultistepFormNext onPress={ next }/>
            <TextDivider
                title={ t("common.or") }
                color={ COLORS.gray1 }
                lineHeight={ 1 }
                marginVertical={ GLOBAL_STYLE.formContainer.gap }
            />
            <Button.Google/>
        </Input.Group>
    );
};