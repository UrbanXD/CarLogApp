import NameStep from "./NameStep";
import CarModelStep from "./CarModelStep";
import OdometerStep from "./OdometerStep";
import FuelStep from "./FuelStep";
import React from "react";
import ImageStep from "./ImageStep";
import { ResultStep, StepProps, Steps } from "../../../constants/types/types.ts";
import CarProfile from "../../../../../components/CarProfile/CarProfile.ts";
import { CarEditNameToast } from "../../../../Alert/presets/toast/CarEditNameToast.ts";

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