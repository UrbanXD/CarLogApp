import React from "react";
import InputImagePicker from "../../../../../components/Input/imagePicker/InputImagePicker.tsx";
import { StepProps } from "../../../../../types/index.ts";
import { useTranslation } from "react-i18next";

export const AvatarStep: React.FC<StepProps> = ({
    control
}) => {
    const { t } = useTranslation();

    return (
        <InputImagePicker
            control={ control }
            fieldName="avatarImage"
            fieldNameText={ t("profile_picture") }
        />
    );
};