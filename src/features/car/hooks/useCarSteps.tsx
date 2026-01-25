import React from "react";
import { ResultStep as ResultStepType, Steps, UseStepFormResult } from "../../../types/index.ts";
import { CarFormFields } from "../schemas/form/carForm.ts";
import CarModelStep from "../components/forms/steps/CarModelStep.tsx";
import NameStep from "../components/forms/steps/NameStep.tsx";
import OdometerStep from "../components/forms/steps/OdometerStep.tsx";
import FuelStep from "../components/forms/steps/FuelStep.tsx";
import ImageStep from "../components/forms/steps/ImageStep.tsx";
import { ResultStep } from "../components/forms/steps/ResultStep.tsx";
import { useTranslation } from "react-i18next";
import { EditToast } from "../../../ui/alert/presets/toast";
import { UseFormReturn } from "react-hook-form";

type UseCarStepsProps = {
    form: UseFormReturn<CarFormFields>;
}

function useCarSteps({ form }: UseCarStepsProps): UseStepFormResult {
    const { t } = useTranslation();
    const { control, formState, setValue, watch } = form;

    const steps: Steps = [
        {
            title: t("car.steps.name.title"),
            fields: ["name"],
            render: () => <NameStep control={ control }/>,
            editToastMessages: EditToast
        },
        {
            title: t("car.steps.model.title"),
            fields: ["model.makeId", "model.id", "model.year"],
            render: () => <CarModelStep control={ control } formState={ formState } setValue={ setValue }/>,
            editToastMessages: EditToast
        },
        {
            title: t("car.steps.odometer.title"),
            fields: ["odometer.value", "odometer.unitId"],
            render: () => <OdometerStep form={ form }/>,
            editToastMessages: EditToast
        },
        {
            title: t("car.steps.fuel.title"),
            fields: ["fuelTank.typeId", "fuelTank.unitId", "fuelTank.capacity"],
            render: () => <FuelStep control={ control }/>,
            editToastMessages: EditToast
        },
        {
            title: t("car.steps.image.title"),
            fields: ["image"],
            render: () => <ImageStep control={ control }/>,
            editToastMessages: EditToast
        }
    ];

    const resultStep: ResultStepType = {
        title: t("multistep_form.result_step"),
        render: (goTo: (stepIndex: number) => void) => {
            const values = watch();

            return <ResultStep formValues={ values } goTo={ goTo }/>;
        }
    };

    return { steps, resultStep: resultStep };
}

export default useCarSteps;