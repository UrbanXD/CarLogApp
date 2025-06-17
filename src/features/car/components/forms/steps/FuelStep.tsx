import React from "react";
import Input from "../../../../Form/components/Input/Input.ts";
import { ICON_NAMES } from "../../../../../constants/index.ts";
import { FUEL_MEASUREMENTS, FUEL_TYPES } from "../../../../Form/constants/constants.ts";
import { StepProps } from "../../../../../types/index.ts";

const FuelStep: React.FC<StepProps> = ({
    control
}) =>
    <Input.Group>
        <Input.Text
            control={ control }
            fieldName="fuelTankSize"
            fieldNameText="Tartály mérete"
            placeholder="000.000.000"
            icon={ ICON_NAMES.odometer }
            numeric
        />
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
    </Input.Group>

export default FuelStep;