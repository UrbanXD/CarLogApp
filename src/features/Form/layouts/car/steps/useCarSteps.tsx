import NameStep from "./NameStep";
import CarModelStep from "./CarModelStep";
import OdometerStep from "./OdometerStep";
import FuelStep from "./FuelStep";
import React from "react";
import ImageStep from "./ImageStep";
import { ResultStep, StepProps, Steps } from "../../../constants/types/types.ts";
import CarProfile from "../../../../CarProfile/components/CarProfile.tsx";

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
                    <NameStep
                        control={control}
                    />
            },
            {
                title: "Modell",
                fields: ["brand", "model"],
                render: () =>
                    <CarModelStep
                        control={control}
                        resetField={resetField}
                    />
            },
            {
                title: "Kilométeróra",
                fields: ["odometerValue", "odometerMeasurement"],
                render: () =>
                    <OdometerStep
                        control={control}
                    />
            },
            {
                title: "Üzemanyag",
                fields: ["fuelType", "fuelMeasurement", "fuelTankSize"],
                render: () =>
                    <FuelStep
                        control={control}
                    />
            },
            {
                title: "Kép",
                fields: ["image"],
                render: () =>
                    <ImageStep
                        control={control}
                    />
            }
        ],
        resultStep: getValues && {
            type: "result",
            title: "Összesítő adatlap", //kitorolni, lehet undifned hiba lesz onboarding eseten idk
            render: (goTo) =>
                <CarProfile car={ getValues() } goTo={ goTo } />
        }
    }
}
export default useCarSteps;