import React from "react";
import { StepProps } from "../../../../constants/types/types";
import Input from "../../../../components/Input/Input";
import { GLOBAL_STYLE, ICON_NAMES } from "../../../../../Shared/constants/constants";
import Button from "../../../../../Button/components/Button";
import TextDivider from "../../../../../Shared/components/TextDivider";
import { theme } from "../../../../../Shared/constants/theme";
import {useMultiStepForm} from "../../../../context/MultiStepFormProvider";

const EmailStep: React.FC<StepProps> = ({
    control,
}) => {
    const { next } = useMultiStepForm();

    return (
        <Input.Group>
            <Input.Text
                isInBottomSheet
                control={ control }
                fieldName="email"
                fieldNameText="Email cím"
                icon={ ICON_NAMES.email }
                placeholder="carlog@gmail.com"
            />
            <Button.Text
                text="Következő"
                iconRight={ ICON_NAMES.rightArrowHead }
                onPress={ next }
            />
            <TextDivider
                title="vagy"
                color={ theme.colors.gray1 }
                lineHeight={ 1 }
                marginVertical={ GLOBAL_STYLE.formContainer.gap }
            />
            <Button.Google
                onPress={() => 1}
            />
        </Input.Group>
    )
}

export default EmailStep;