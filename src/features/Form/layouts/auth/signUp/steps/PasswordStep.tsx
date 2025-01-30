import React from "react";
import {StepProps} from "../../../../constants/types/types";
import Input from "../../../../components/Input/Input";
import {ICON_NAMES} from "../../../../../Shared/constants/constants";

const PasswordStep: React.FC<StepProps> = ({ control }) =>
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

export default PasswordStep;