import React from "react";
import Input from "../../../../../components/Input/Input.ts";
import { StepProps } from "../../../../../types/index.ts";
import { CarFormFields } from "../../../schemas/form/carForm.ts";
import { OdometerUnitInput } from "../../../_features/odometer/components/forms/inputFields/OdometerUnitInput.tsx";
import { OdometerValueInput } from "../../../_features/odometer/components/forms/inputFields/OdometerValueInput.tsx";

type OdometerStepProps<FormFields> = Pick<StepProps<FormFields>, "control">;

function OdometerStep<FormFields = CarFormFields>({ control }: OdometerStepProps<FormFields>) {
    return (
        <Input.Group>
            <OdometerValueInput
                control={ control }
                fieldName="odometer.value"
            />
            <OdometerUnitInput
                control={ control }
                fieldName="odometer.unitId"
                title={ "Mértékegység" }
            />
        </Input.Group>
    );
}

export default OdometerStep;