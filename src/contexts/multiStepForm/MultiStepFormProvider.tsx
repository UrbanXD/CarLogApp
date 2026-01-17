import React, { ReactNode, useEffect, useMemo, useState } from "react";
import { Keyboard } from "react-native";
import { ResultStep, Steps, SubmitHandlerArgs } from "../../types/index.ts";
import { MultiStepFormContext } from "./MultiStepFormContext.ts";
import { UseFormReturn } from "react-hook-form";

type MultiStepFormProviderProps = {
    children: ReactNode | null
    form: UseFormReturn
    steps: Steps
    submitHandler: SubmitHandlerArgs<any>
    resultStep?: ResultStep
    isFirstCount?: boolean
}

export const MultiStepFormProvider: React.FC<MultiStepFormProviderProps> = ({
    children,
    form,
    steps,
    submitHandler,
    resultStep,
    isFirstCount = true
}) => {
    const [formSteps, setFormSteps] = useState<Steps>(steps);
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const tmpSteps = steps;
        if(resultStep) tmpSteps.push({ ...resultStep, fields: [], render: () => resultStep.render(goTo) });

        setFormSteps(tmpSteps);
    }, [steps, resultStep]);

    const submit = useMemo(() => (
        form.handleSubmit(submitHandler.onValid, (errors, event) => {
            submitHandler.onInvalid?.(errors, event);
            if(Object.keys(errors).length > 0) {
                const firstErrorStepIndex = steps.findIndex(step => step.fields.some(field => errors[field]));

                if(firstErrorStepIndex !== -1) return goTo(firstErrorStepIndex);
            }
        })
    ), [form, submitHandler]);

    const isFirstStep = () => currentStep === 0;

    const isLastStep = () => currentStep >= formSteps.length - 1;

    const next = async () => {
        if(isLastStep()) {
            await submit();
            return;
        }

        const currentStepFields = formSteps[currentStep]?.fields;
        if(currentStepFields && currentStepFields.length > 0) {
            const isValid = await form.trigger(currentStepFields);

            if(!isValid) return;
        }

        Keyboard.dismiss();
        setCurrentStep(prevState => ++prevState);
    };

    const back = () => {
        if(isFirstStep()) return;

        Keyboard.dismiss();
        setCurrentStep(prevState => --prevState);
    };

    const goTo = (index: number) => {
        if(index < 0 || index >= formSteps.length) return;
        setCurrentStep(index);
    };

    const getCurrentStepText = () => (currentStep + (isFirstCount ? 1 : 0)).toString();

    const getRealStepsCount = () => (formSteps.length - (!isFirstCount ? 1 : 0) - (!!resultStep ? 1 : 0));

    return (
        <MultiStepFormContext.Provider
            value={ {
                steps: formSteps,
                currentStep,
                currentStepText: getCurrentStepText(),
                realStepsCount: getRealStepsCount(),
                isFirstCount,
                isLastCount: !resultStep,
                isFirstStep: isFirstStep(),
                isLastStep: isLastStep(),
                goTo,
                next,
                back
            } }
        >
            { children }
        </MultiStepFormContext.Provider>
    );
};