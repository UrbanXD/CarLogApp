import React from "react";
import Input from "../../../../../components/Input/Input.ts";
import { StepProps } from "../../../../../types/index.ts";
import { CarFormFields } from "../../../schemas/form/carForm.ts";
import { FuelUnitInput } from "../../../_features/fuel/components/forms/inputFields/FuelUnitInput.tsx";
import { FuelTankCapacityInput } from "../../../_features/fuel/components/forms/inputFields/FuelTankCapacityInput.tsx";
import { useTranslation } from "react-i18next";
import { FuelTypeInput } from "../../../_features/fuel/components/forms/inputFields/FuelTypeInput.tsx";

type FuelStepProps<FormFields> = Pick<StepProps<FormFields>, "control">

function FuelStep<FormFields = CarFormFields>({ control }: FuelStepProps<FormFields>) {
    const { t } = useTranslation();

    return (
        <Input.Group>
            <FuelTankCapacityInput
                control={ control }
                fieldName="fuelTank.capacity"
            />
            <FuelTypeInput
                control={ control }
                fieldName="fuelTank.typeId"
                title={ t("car.steps.fuel.type_field.title") }
            />
            <FuelUnitInput
                control={ control }
                fieldName="fuelTank.unitId"
                title={ t("car.steps.fuel.unit_field.title") }
            />
        </Input.Group>
    );
}

export default FuelStep;