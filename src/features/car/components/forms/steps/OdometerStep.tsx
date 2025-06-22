import React from "react";
import Input from "../../../../../components/Input/Input.ts";
import { ICON_NAMES } from "../../../../../constants/index.ts";
import { ODOMETER_MEASUREMENTS } from "../../../constants/index.ts";
import { StepProps } from "../../../../../types/index.ts";

const OdometerStep: React.FC<StepProps> = ({
    control
}) =>
    <Input.Group>
        <Input.Field
            control={ control }
            fieldName="odometerValue"
            fieldNameText="Kilóméteróra állás"
        >
            <Input.Text
                icon={ ICON_NAMES.odometer }
                placeholder="100000"
                numeric
            />
        </Input.Field>
        <Input.Picker
            data={ ODOMETER_MEASUREMENTS }
            control={ control }
            fieldName="odometerMeasurement"
            fieldNameText="Mértékegység"
            isHorizontal
            isCarousel={ false }
        />
    </Input.Group>;

export default OdometerStep;