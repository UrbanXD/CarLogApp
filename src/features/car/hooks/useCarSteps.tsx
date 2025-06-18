import NameStep from "../components/forms/steps/NameStep.tsx";
import CarModelStep from "../components/forms/steps/CarModelStep.tsx";
import OdometerStep from "../components/forms/steps/OdometerStep.tsx";
import FuelStep from "../components/forms/steps/FuelStep.tsx";
import React from "react";
import ImageStep from "../components/forms/steps/ImageStep.tsx";
import CarProfile from "../components/carProfile/CarProfile.ts";
import { CarEditNameToast } from "../presets/toast/CarEditNameToast.ts";
import { ResultStep, StepProps, Steps } from "../../../../../types/index.ts";

export enum CAR_FORM_STEPS {
    NameStep,
    CarModelStep,
    OdometerStep,
    FuelStep,
    ImageStep,
    ResultStep
}

const useCarSteps = (
    control: StepProps["control"],
    resetField: StepProps["resetField"],
    getValues?: StepProps["getValues"],
): { steps: Steps, resultStep?: ResultStep } => {
    return {
        steps: [
            {
                title: "Elnevezés",
                fields: ["name"],
                render: () =>
                    <NameStep control={ control } />,
                editToastMessages: CarEditNameToast
            },
            {
                title: "Modell",
                fields: ["brand", "model"],
                render: () =>
                    <CarModelStep
                        control={ control }
                        resetField={ resetField }
                    />,
                editToastMessages: CarEditNameToast
            },
            {
                title: "Kilométeróra",
                fields: ["odometerValue", "odometerMeasurement"],
                render: () =>
                    <OdometerStep control={ control } />,
                editToastMessages: CarEditNameToast
            },
            {
                title: "Üzemanyag",
                fields: ["fuelType", "fuelMeasurement", "fuelTankSize"],
                render: () =>
                    <FuelStep control={ control } />,
                editToastMessages: CarEditNameToast
            },
            {
                title: "Kép",
                fields: ["image"],
                render: () =>
                    <ImageStep control={ control } />,
                editToastMessages: CarEditNameToast
            }
        ],
        resultStep: getValues && {
            type: "result",
            render: (goTo) =>
                <CarProfile.ByObj car={ getValues() } goTo={ goTo } />
        }
    }
}
export default useCarSteps;