import {Control, UseFormResetField} from "react-hook-form";
import NameStep from "./NameStep";
import CarModelStep from "./CarModelStep";
import OdometerStep from "./OdometerStep";
import FuelStep from "./FuelStep";
import React from "react";
import ImageStep from "./ImageStep";

export enum CAR_FORM_STEPS {
    NameStep,
    CarModelStep,
    OdometerStep,
    FuelStep,
    ImageStep
}

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
        () =>
            <ImageStep
                control={ control }
            />
    ]

export default useCarSteps;