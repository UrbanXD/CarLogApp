import React from "react";
import {StepProps} from "../../../constants/types/types";
import InputImagePicker from "../../../components/Input/imagePicker/InputImagePicker";

const ImageStep: React.FC<StepProps> = ({
    control
}) =>
    <InputImagePicker
        control={ control }
        fieldName="image"
        fieldNameText={"Autó profilkép"}
    />

export default ImageStep;