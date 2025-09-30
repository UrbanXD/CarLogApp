import React from "react";
import Input from "../../../../../components/Input/Input.ts";
import { ICON_NAMES } from "../../../../../constants/index.ts";
import { ODOMETER_MEASUREMENTS } from "../../../constants/index.ts";
import { StepProps } from "../../../../../types/index.ts";
import { generatePickerItems } from "../../../../../utils/toPickerItems.ts";
import { CarFormFields } from "../../../schemas/form/carForm.ts";

type OdometerStepProps<FormFields> = Pick<StepProps<FormFields>, "control">;

function OdometerStep<FormFields = CarFormFields>({ control }: OdometerStepProps<FormFields>) {
    return (
        <Input.Group>
            <Input.Field
                control={ control }
                fieldName="odometer.value"
                fieldNameText="Kilóméteróra állás"
            >
                <Input.Text
                    icon={ ICON_NAMES.odometer }
                    placeholder="100000"
                    numeric
                />
            </Input.Field>
            <Input.Field
                control={ control }
                fieldName="odometer.unit"
                fieldNameText="Mértékegység"
            >
                <Input.Picker.Simple items={ generatePickerItems(ODOMETER_MEASUREMENTS) }/>
            </Input.Field>
        </Input.Group>
    );
}

export default OdometerStep;