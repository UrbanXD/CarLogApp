import React from "react";
import Input from "../../../../../components/Input/Input.ts";
import { ICON_NAMES } from "../../../../../constants/index.ts";
import { StepProps } from "../../../../../types/index.ts";

export const EmailStep: React.FC<StepProps> = ({
    control
}) =>
    <Input.Field
        control={ control }
        fieldName="email"
        fieldNameText="Email cím"
    >
        <Input.Text
            icon={ ICON_NAMES.email }
            placeholder="carlog@gmail.com"
            keyboardType="email-address"
        />
    </Input.Field>;