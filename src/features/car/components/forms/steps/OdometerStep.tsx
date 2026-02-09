import React from "react";
import Input from "../../../../../components/Input/Input.ts";
import { CarFormFields } from "../../../schemas/form/carForm.ts";
import { OdometerUnitInput } from "../../../_features/odometer/components/forms/inputFields/OdometerUnitInput.tsx";
import { OdometerValueInput } from "../../../_features/odometer/components/forms/inputFields/OdometerValueInput.tsx";
import { useTranslation } from "react-i18next";
import { UseFormReturn } from "react-hook-form";

type OdometerStepProps = {
    form: UseFormReturn<CarFormFields, any, CarFormFields>
}

function OdometerStep({ form }: OdometerStepProps) {
    const { t } = useTranslation();
    const { control, setValue, getFieldState } = form;

    return (
        <Input.Group>
            <OdometerValueInput
                control={ control }
                setValue={ setValue }
                getFieldState={ getFieldState }
                odometerValueFieldName="odometer.value"
                showLimits={ false }
            />
            <OdometerUnitInput
                control={ control }
                fieldName="odometer.unitId"
                title={ t("car.steps.odometer.unit_field.title") }
            />
        </Input.Group>
    );
}

export default OdometerStep;