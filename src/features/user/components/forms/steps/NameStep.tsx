import React from "react";
import Input from "../../../../../components/Input/Input.ts";
import { ICON_NAMES } from "../../../../../constants/index.ts";
import { StepProps } from "../../../../../types/index.ts";
import { useTranslation } from "react-i18next";

export const NameStep: React.FC<StepProps> = ({ control }) => {
    const { t } = useTranslation();

    return (
        <Input.Group>
            <Input.Field
                control={ control }
                fieldName="lastname"
                fieldNameText={ t("auth.user.lastname") }
            >
                <Input.Text
                    icon={ ICON_NAMES.user }
                    placeholder={ t("auth.user.lastname_placeholder") }
                />
            </ Input.Field>
            <Input.Field
                control={ control }
                fieldName="firstname"
                fieldNameText={ t("auth.user.firstname") }
            >
                <Input.Text
                    icon={ ICON_NAMES.user }
                    placeholder={ t("auth.user.firstname_placeholder") }
                />
            </Input.Field>
        </Input.Group>
    );
};