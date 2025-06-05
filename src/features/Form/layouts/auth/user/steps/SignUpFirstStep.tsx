import React from "react";
import { StepProps } from "../../../../constants/types/types.ts";
import Input from "../../../../components/Input/Input.ts";
import { GLOBAL_STYLE, ICON_NAMES } from "../../../../../../constants/constants.ts";
import Button from "../../../../../../components/Button/Button.ts";
import TextDivider from "../../../../../../components/TextDivider.tsx";
import { Colors } from "../../../../../../constants/colors";
import { useMultiStepForm } from "../../../../context/MultiStepFormProvider.tsx";
import { EmailStep } from "./EmailStep.tsx";

export const SignUpFirstStep: React.FC<StepProps> = ({
    control,
}) => {
    const { next } = useMultiStepForm();

    return (
        <Input.Group>
            <EmailStep control={ control } />
            <Button.Text
                text="Következő"
                iconRight={ ICON_NAMES.rightArrowHead }
                onPress={ next }
            />
            <TextDivider
                title="vagy"
                color={ Colors.gray1 }
                lineHeight={ 1 }
                marginVertical={ GLOBAL_STYLE.formContainer.gap }
            />
            <Button.Google />
        </Input.Group>
    )
}