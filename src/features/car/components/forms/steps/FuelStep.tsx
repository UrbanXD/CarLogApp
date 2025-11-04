import React from "react";
import Input from "../../../../../components/Input/Input.ts";
import { StepProps } from "../../../../../types/index.ts";
import { CarFormFields } from "../../../schemas/form/carForm.ts";
import { FuelTypeInput } from "../../../_features/fuel/components/forms/inputFields/FuelTypeInput.tsx";
import { FuelUnitInput } from "../../../_features/fuel/components/forms/inputFields/FuelUnitInput.tsx";
import { FuelTankCapacityInput } from "../../../_features/fuel/components/forms/inputFields/FuelTankCapacityInput.tsx";

type FuelStepProps<FormFields> = Pick<StepProps<FormFields>, "control">

function FuelStep<FormFields = CarFormFields>({ control }: FuelStepProps<FormFields>) {
    return (
        <Input.Group>
            <FuelTankCapacityInput control={ control } fieldName="fuelTank.capacity"/>
            <FuelTypeInput control={ control } fieldName="fuelTank.typeId" title={ "Típus" }/>
            <FuelUnitInput control={ control } fieldName="fuelTank.unitId" title={ "Mértékegység" }/>
        </Input.Group>
    );
}

export default FuelStep;