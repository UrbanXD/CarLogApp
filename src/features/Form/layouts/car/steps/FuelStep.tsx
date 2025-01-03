import React from "react";
import {StepProps} from "../../../constants/types/types";
import Input from "../../../components/Input/Input";
import {ICON_NAMES} from "../../../../Shared/constants/constants";
import {FUEL_MEASUREMENTS, FUEL_TYPES} from "../../../constants/constants";

const FuelStep: React.FC<StepProps> = ({
    control
}) =>
    <>
        <Input.Picker
            data={ FUEL_TYPES }
            control={ control }
            fieldName="fuelType"
            fieldNameText="Uzemanyag tipus"
            isHorizontal
            isCarousel={ false }
        />
        <Input.Picker
            data={ FUEL_MEASUREMENTS }
            control={ control }
            fieldName="fuelMeasurement"
            fieldNameText="Uzemanyag mertekegyseg"
            isHorizontal
            isCarousel={ false }
        />
        <Input.Text
            control={ control }
            fieldName="fuelTankSize"
            fieldNameText="Uzemanyag tartaly merete"
            placeholder="000.000.000"
            icon={ ICON_NAMES.odometer }
            numeric
        />
    </>

export default FuelStep;