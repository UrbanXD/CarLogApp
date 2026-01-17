import React from "react";
import Input from "../../../../../components/Input/Input.ts";
import { ICON_NAMES } from "../../../../../constants/index.ts";
import { StepProps } from "../../../../../types/index.ts";
import { useTranslation } from "react-i18next";

export const PasswordStep: React.FC<StepProps> = ({ control }) => {
    const { t } = useTranslation();

    return (
        <Input.Group>
            <Input.Field
                control={ control }
                fieldName="password"
                fieldNameText={ t("auth.user.password") }
            >
                <Input.Text
                    icon={ ICON_NAMES.password }
                    placeholder={ t("auth.user.password_placeholder") }
                    secure
                />
            </Input.Field>
            <Input.Field
                control={ control }
                fieldName="rpassword"
                fieldNameText={ t("auth.user.repeat_password") }
            >
                <Input.Text
                    icon={ ICON_NAMES.password }
                    placeholder={ t("auth.user.repeat_password_placeholder") }
                    secure
                />
            </Input.Field>
        </Input.Group>
    );
};