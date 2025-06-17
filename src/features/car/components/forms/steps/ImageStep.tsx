import React from "react";
import { StepProps } from "../../../../Form/constants/types/types.ts";
import InputImagePicker from "../../../../Form/components/Input/imagePicker/InputImagePicker.tsx";

const ImageStep: React.FC<StepProps> = ({
    control
}) =>
    <InputImagePicker
        control={ control }
        fieldName="image"
        fieldNameText={"Autó profilkép"}
    />

export default ImageStep;