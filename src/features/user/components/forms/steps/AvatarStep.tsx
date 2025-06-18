import React from "react";
import InputImagePicker from "../../../../../components/Input/imagePicker/InputImagePicker.tsx";
import { StepProps } from "../../../../../types/index.ts";

export const AvatarStep: React.FC<StepProps> = ({
    control
}) =>
    <InputImagePicker
        control={ control }
        fieldName="avatarImage"
        fieldNameText="Profilkép"
    />