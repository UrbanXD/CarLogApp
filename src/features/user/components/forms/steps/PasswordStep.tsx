import React from "react";
import Input from "../../../../../components/Input/Input.ts";
import { ICON_NAMES } from "../../../../../constants/index.ts";
import { StepProps } from "../../../../../types/index.ts";

export const PasswordStep: React.FC<StepProps> = ({ control }) =>
    <Input.Group>
        <Input.Field
            control={ control }
            fieldName="password"
            fieldNameText="Jelszó"
        >
            <Input.Text
                icon={ ICON_NAMES.password }
                placeholder="*****"
                isSecure
            />
        </Input.Field>
        <Input.Field
            control={ control }
            fieldName="rpassword"
            fieldNameText="Jelszó újra"
        >
            <Input.Text
                icon={ ICON_NAMES.password }
                placeholder="*****"
                isSecure
            />
        </Input.Field>
    </Input.Group>;