import NameStep from "./NameStep";
import CarModelStep from "./CarModelStep";
import OdometerStep from "./OdometerStep";
import FuelStep from "./FuelStep";
import React from "react";
import ImageStep from "./ImageStep";
import { StepProps, Steps } from "../../../constants/types/types.ts";

export enum CAR_FORM_STEPS {
    NameStep,
    CarModelStep,
    OdometerStep,
    FuelStep,
    ImageStep
}

const useCarSteps = (
    control: StepProps["control"],
    resetField: StepProps["resetField"],
): Steps =>
    [
        {
            title: "Elnevezés",
            fields: ["name"],
            render: () =>
                <NameStep
                    control={ control }
                />
        },
        {
            title: "Modell",
            fields: ["brand", "model"],
            render: () =>
                <CarModelStep
                    control={ control }
                    resetField={ resetField }
                />
        },
        {
            title: "Kilométeróra",
            fields: ["odometerValue", "odometerMeasurement"],
            render: () =>
                <OdometerStep
                    control={ control }
                />
        },
        {
            title: "Üzemanyag",
            fields: ["fuelType", "fuelMeasurement", "fuelTankSize"],
            render: () =>
                <FuelStep
                    control={ control }
                />
        },
        {
            title: "Kép",
            fields: ["image"],
            render: () =>
                <ImageStep
                    control={ control }
                />
        },
    ]

export default useCarSteps;