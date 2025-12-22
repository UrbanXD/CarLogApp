import React from "react";
import InputImagePicker from "../../../../../components/Input/imagePicker/InputImagePicker.tsx";
import { StepProps } from "../../../../../types/index.ts";
import { useTranslation } from "react-i18next";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

export const AvatarStep: React.FC<StepProps> = ({
    control
}) => {
    const { t } = useTranslation();

    return (
        <InputImagePicker
            control={ control }
            fieldName="avatar"
            fieldNameText={ t("profile_picture") }
            imageStyle={ {
                width: hp(20),
                height: hp(20),
                borderWidth: hp(1),
                borderColor: "transparent",
                borderRadius: 100
            } }
        />
    );
};