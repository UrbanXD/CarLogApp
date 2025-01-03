import {Control, UseFormResetField} from "react-hook-form";
import NameStep from "./NameStep";
import CarModelStep from "./CarModelStep";
import OdometerStep from "./OdometerStep";
import FuelStep from "./FuelStep";
import React from "react";

const useCarSteps = (
    control: Control<any>,
    resetField: UseFormResetField<any>
) =>
    [
        () =>
            <NameStep
                control={ control }
            />,
        () =>
            <CarModelStep
                control={ control }
                resetField={ resetField }
            />,
        () =>
            <OdometerStep
                control={ control }
            />,
        () =>
            <FuelStep
                control={ control }
            />,
    ]

export default useCarSteps;