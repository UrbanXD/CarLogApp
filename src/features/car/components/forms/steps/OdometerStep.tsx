import React from "react";
import { StepProps } from "../../../../Form/constants/types/types.ts";
import Input from "../../../../Form/components/Input/Input.ts";
import { ICON_NAMES } from "../../../../../constants/index.ts";
import { ODOMETER_MEASUREMENTS } from "../../../../Form/constants/constants.ts";

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