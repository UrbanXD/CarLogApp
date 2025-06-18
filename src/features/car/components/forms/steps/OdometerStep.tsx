import React from "react";
import Input from "../../../../../components/Input/Input.ts";
import { ICON_NAMES } from "../../../../../constants/index.ts";
import { ODOMETER_MEASUREMENTS } from "../../../constants/index.ts";
import { StepProps } from "../../../../../types/index.ts";

const OdometerStep: React.FC<StepProps> = ({
    control
}) =>
    <Input.Group>
        <Input.Text
            control={ control }
            fieldName="odometerValue"
            fieldNameText="Kilóméteróra állás"
            placeholder="000.000.000"
            icon={ ICON_NAMES.odometer }
            numeric
        />
        <Input.Picker
            data={ ODOMETER_MEASUREMENTS }
            control={ control }
            fieldName="odometerMeasurement"
            fieldNameText="Mértékegység"
            isHorizontal
            isCarousel={ false }
        />
    </Input.Group>

export default OdometerStep;