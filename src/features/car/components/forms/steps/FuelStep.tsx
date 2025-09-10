import React from "react";
import Input from "../../../../../components/Input/Input.ts";
import { ICON_NAMES } from "../../../../../constants/index.ts";
import { FUEL_MEASUREMENTS, FUEL_TYPES } from "../../../constants/index.ts";
import { StepProps } from "../../../../../types/index.ts";
import { generatePickerItems } from "../../../../../utils/toPickerItems.ts";
import { CarFormFields } from "../../../schemas/form/carForm.ts";

type FuelStepProps<FormFields> = Pick<StepProps<FormFields>, "control">

function FuelStep<FormFields = CarFormFields>({ control }: FuelStepProps<FormFields>) {
    return (
        <Input.Group>
            <Input.Field
                control={ control }
                fieldName="fuelTank.capacity"
                fieldNameText="Tartály mérete"
            >
                <Input.Text
                    icon={ ICON_NAMES.odometer }
                    placeholder={ "250" }
                    numeric
                />
            </Input.Field>
            <Input.Field
                control={ control }
                fieldName="fuelTank.type"
                fieldNameText="Típus"
            >
                <Input.Picker.Simple items={ generatePickerItems(FUEL_TYPES) }/>
            </Input.Field>
            <Input.Field
                control={ control }
                fieldName="fuelTank.measurement"
                fieldNameText="Mértékegység"
            >
                <Input.Picker.Simple items={ generatePickerItems(FUEL_MEASUREMENTS) }/>
            </Input.Field>
        </Input.Group>
    );
}

export default FuelStep;