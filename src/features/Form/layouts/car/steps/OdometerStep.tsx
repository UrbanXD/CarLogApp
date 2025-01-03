import React from "react";
import {StepProps} from "../../../constants/types/types";
import Input from "../../../components/Input/Input";
import {ICON_NAMES} from "../../../../Shared/constants/constants";
import {ODOMETER_MEASUREMENTS} from "../../../constants/constants";

const OdometerStep: React.FC<StepProps> = ({
    control
}) =>
    <>
        <Input.Text
            control={ control }
            fieldName="odometerValue"
            fieldNameText="Kilometerora alass"
            placeholder="000.000.000"
            icon={ ICON_NAMES.odometer }
            numeric
        />
        <Input.Picker
            data={ ODOMETER_MEASUREMENTS }
            control={ control }
            fieldName="odometerMeasurement"
            fieldNameText="Mertekegyseg"
            isHorizontal
            isCarousel={ false }
        />
    </>

export default OdometerStep;