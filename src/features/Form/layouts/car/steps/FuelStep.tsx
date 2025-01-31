import React from "react";
import {StepProps} from "../../../constants/types/types";
import Input from "../../../components/Input/Input";
import {ICON_NAMES} from "../../../../../constants/constants";
import {FUEL_MEASUREMENTS, FUEL_TYPES} from "../../../constants/constants";

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