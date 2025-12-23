import React from "react";
import { StepProps } from "../../../../../types/index.ts";
import { CarFormFields } from "../../../schemas/form/carForm.ts";
import { useTranslation } from "react-i18next";
import Input from "../../../../../components/Input/Input.ts";

type ImageStepProps<FormFields> = Pick<StepProps<FormFields>, "control">;

function ImageStep<FormFields = CarFormFields>({ control }: ImageStepProps<FormFields>) {
    const { t } = useTranslation();

    return (
        <Input.Field
            control={ control }
            fieldName="image"
            fieldNameText={ t("car.steps.image.image_field.title") }
        >
            <Input.ImagePicker/>
        </Input.Field>
    );
}

export default ImageStep;