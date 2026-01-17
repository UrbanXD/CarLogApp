import React from "react";
import Input from "../../../../../components/Input/Input.ts";
import { ICON_NAMES } from "../../../../../constants/index.ts";
import { StepProps } from "../../../../../types/index.ts";
import { CarFormFields } from "../../../schemas/form/carForm.ts";
import { useTranslation } from "react-i18next";

type NameStepProps = Pick<StepProps<CarFormFields>, "control">;

function NameStep({ control }: NameStepProps) {
    const { t } = useTranslation();

    return (
        <Input.Field
            control={ control }
            fieldName="name"
            fieldNameText={ t("car.steps.name.name_field.title") }
            fieldInfoText={ t("car.steps.name.name_field.info") }
        >
            <Input.Text
                icon={ ICON_NAMES.nametag }
                placeholder={ t("car.steps.name.name_field.placeholder") }
            />
        </Input.Field>
    );
}

export default NameStep;