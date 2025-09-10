import React from "react";
import InputImagePicker from "../../../../../components/Input/imagePicker/InputImagePicker.tsx";
import { StepProps } from "../../../../../types/index.ts";
import { CarFormFields } from "../../../schemas/form/carForm.ts";

type ImageStepProps<FormFields> = Pick<StepProps<FormFields>, "control">;

function ImageStep<FormFields = CarFormFields>({ control }: ImageStepProps<FormFields>) {
    return (
        <InputImagePicker
            control={ control }
            fieldName="image"
            fieldNameText={ "Autó profilkép" }
        />
    );
}

export default ImageStep;