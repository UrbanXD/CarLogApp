import React from "react";
import { StepProps } from "../../../../../types/index.ts";
import { CarFormFields } from "../../../schemas/form/carForm.ts";
import { useTranslation } from "react-i18next";
import Input from "../../../../../components/Input/Input.ts";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { ICON_NAMES } from "../../../../../constants/index.ts";

type ImageStepProps<FormFields> = Pick<StepProps<FormFields>, "control">;

function ImageStep<FormFields = CarFormFields>({ control }: ImageStepProps<FormFields>) {
    const { t } = useTranslation();

    return (
        <Input.Field
            control={ control }
            fieldName="image"
            fieldNameText={ t("car.steps.image.image_field.title") }
        >
            <Input.ImagePicker
                imageStyle={ { height: hp(22.5) } }
                alt={ ICON_NAMES.car }
            />
        </Input.Field>
    );
}

export default ImageStep;