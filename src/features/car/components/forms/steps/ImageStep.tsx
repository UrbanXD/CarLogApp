import React from "react";
import InputImagePicker from "../../../../../components/Input/imagePicker/InputImagePicker.tsx";
import { StepProps } from "../../../../../types/index.ts";
import { CarFormFields } from "../../../schemas/form/carForm.ts";
import { useTranslation } from "react-i18next";

type ImageStepProps<FormFields> = Pick<StepProps<FormFields>, "control">;

function ImageStep<FormFields = CarFormFields>({ control }: ImageStepProps<FormFields>) {
    const { t } = useTranslation();

    return (
        <InputImagePicker
            control={ control }
            fieldName="image"
            fieldNameText={ t("car.steps.image.image_field.title") }
        />
    );
}

export default ImageStep;