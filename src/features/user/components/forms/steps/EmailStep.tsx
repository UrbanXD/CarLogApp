import React from "react";
import Input from "../../../../../components/Input/Input.ts";
import { ICON_NAMES } from "../../../../../constants/index.ts";
import { StepProps } from "../../../../../types/index.ts";
import { useTranslation } from "react-i18next";

export const EmailStep: React.FC<StepProps> = ({
    control
}) => {
    const { t } = useTranslation();

    return (
        <Input.Field
            control={ control }
            fieldName="email"
            fieldNameText={ t("auth.user.email") }
        >
            <Input.Text
                icon={ ICON_NAMES.email }
                placeholder={ t("auth.user.email_placeholder") }
                keyboardType="email-address"
            />
        </Input.Field>
    );
};