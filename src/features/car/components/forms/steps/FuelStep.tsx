import React from "react";
import Input from "../../../../../components/Input/Input.ts";
import { ICON_NAMES } from "../../../../../constants/index.ts";
import { FUEL_MEASUREMENTS, FUEL_TYPES } from "../../../constants/index.ts";
import { StepProps } from "../../../../../types/index.ts";
import { generatePickerItems } from "../../../../../utils/toPickerItems.ts";

const FuelStep: React.FC<StepProps> = ({ control }) =>
    <Input.Group>
        <Input.Field
            control={ control }
            fieldName="fuelTankSize"
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
            fieldName="fuelType"
            fieldNameText="Típus"
        >
            <Input.Picker.Simple items={ generatePickerItems(FUEL_TYPES) }/>
        </Input.Field>
        <Input.Field
            control={ control }
            fieldName="fuelMeasurement"
            fieldNameText="Mértékegység"
        >
            <Input.Picker.Simple items={ generatePickerItems(FUEL_MEASUREMENTS) }/>
        </Input.Field>
    </Input.Group>;

export default FuelStep;