import React from "react";
import Input from "../../../../components/Input/Input.ts";
import { ICON_NAMES } from "../../../../../../constants/index.ts";
import { StepProps } from "../../../../../../types/index.ts";

export const PasswordStep: React.FC<StepProps> = ({ control }) =>
    <Input.Group>
        <Input.Text
            control={ control }
            fieldName="password"
            fieldNameText="Jelszó"
            icon={ ICON_NAMES.password }
            placeholder="*****"
            isSecure
            isInBottomSheet

        />
        <Input.Text
            control={ control }
            fieldName="rpassword"
            fieldNameText="Jelszó újra"
            icon={ ICON_NAMES.password }
            placeholder="*****"
            isSecure
            isInBottomSheet
        />
    </Input.Group>