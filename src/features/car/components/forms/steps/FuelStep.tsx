import React from "react";
import Input from "../../../../../components/Input/Input.ts";
import { ICON_NAMES } from "../../../../../constants/index.ts";
import { FUEL_MEASUREMENTS, FUEL_TYPES } from "../../../constants/index.ts";
import { StepProps } from "../../../../../types/index.ts";

const FuelStep: React.FC<StepProps> = ({
    control
}) =>
    <Input.Group>
        <Input.Field
            control={ control }
            fieldName="fuelTankSize"
            fieldNameText="Tartály mérete"
        >
            <Input.Text
                icon={ ICON_NAMES.odometer }
                placeholder={ "2000" }
                numeric
            />
        </Input.Field>
        <Input.Field
            control={ control }
            fieldName="fuelValue"
            fieldNameText="Tartály tartalma"
        >
            <Input.Slider
                minValue={ 0 }
                maxValue={ 100 }
            />
        </Input.Field>
        <Input.Picker
            data={ FUEL_TYPES }
            control={ control }
            fieldName="fuelType"
            fieldNameText="Típus"
            isHorizontal
            isCarousel={ false }
        />
        <Input.Picker
            data={ FUEL_MEASUREMENTS }
            control={ control }
            fieldName="fuelMeasurement"
            fieldNameText="Mértékegység"
            isHorizontal
            isCarousel={ false }
        />
    </Input.Group>;

export default FuelStep;