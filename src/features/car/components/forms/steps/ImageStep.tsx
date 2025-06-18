import React from "react";
import InputImagePicker from "../../../../../components/Input/imagePicker/InputImagePicker.tsx";
import { StepProps } from "../../../../../types/index.ts";

const ImageStep: React.FC<StepProps> = ({
    control
}) =>
    <InputImagePicker
        control={ control }
        fieldName="image"
        fieldNameText={"Autó profilkép"}
    />

export default ImageStep;