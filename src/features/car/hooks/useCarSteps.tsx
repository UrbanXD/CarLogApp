import React from "react";
import { StepProps, Steps, UseStepFormResult } from "../../../types/index.ts";
import { CarFormFields } from "../schemas/form/carForm.ts";
import CarModelStep from "../components/forms/steps/CarModelStep.tsx";
import NameStep from "../components/forms/steps/NameStep.tsx";
import OdometerStep from "../components/forms/steps/OdometerStep.tsx";
import FuelStep from "../components/forms/steps/FuelStep.tsx";
import ImageStep from "../components/forms/steps/ImageStep.tsx";
import { ResultStep } from "../components/forms/steps/ResultStep.tsx";
import { CarEditNameToast } from "../presets/toast/index.ts";

function useCarSteps({ control, resetField, setValue, getValues }: StepProps<CarFormFields>): UseStepFormResult {
    const steps: Steps = [
        {
            title: "Elnevezés",
            fields: ["name"],
            render: () => <NameStep control={ control }/>,
            editToastMessages: CarEditNameToast
        },
        {
            title: "Modell",
            fields: ["model.makeId", "model.id", "model.year"],
            render: () => <CarModelStep control={ control } resetField={ resetField } setValue={ setValue }/>,
            editToastMessages: CarEditNameToast
        },
        {
            title: "Kilométeróra",
            fields: ["odometer.value", "odometer.unitId"],
            render: () => <OdometerStep control={ control }/>,
            editToastMessages: CarEditNameToast
        },
        {
            title: "Üzemanyag",
            fields: ["fuelTank.typeId", "fuelTank.unitId", "fuelTank.capacity"],
            render: () => <FuelStep control={ control }/>,
            editToastMessages: CarEditNameToast
        },
        {
            title: "Kép",
            fields: ["image"],
            render: () => <ImageStep control={ control }/>,
            editToastMessages: CarEditNameToast
        }
    ];

    const resultStep = {
        type: "result",
        render: (goTo: (stepIndex?: number) => void) => {
            const values = getValues();

            return <ResultStep formValues={ values } goTo={ goTo }/>;
        }
    };

    return { steps, resultStep: getValues && resultStep };
}

export default useCarSteps;