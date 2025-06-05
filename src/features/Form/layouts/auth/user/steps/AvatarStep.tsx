import React from "react";
import { StepProps } from "../../../../constants/types/types.ts";
import InputImagePicker from "../../../../components/Input/imagePicker/InputImagePicker.tsx";

export const AvatarStep: React.FC<StepProps> = ({
    control
}) =>
    <InputImagePicker
        control={ control }
        fieldName="avatarImage"
        fieldNameText="Profilkép"
    />