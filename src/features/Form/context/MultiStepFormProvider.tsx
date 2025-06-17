import React, { Context, createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Control, SubmitHandler, UseFormResetField, UseFormTrigger } from "react-hook-form";
import { Keyboard } from "react-native";
import { ResultStep, Steps } from "../../../types/index.ts";

interface MultiStepFormProviderValue {
    steps: Steps
    control: Control<any>
    submitHandler: SubmitHandler<any>
    trigger: UseFormTrigger<any>
    resetField?: UseFormResetField<any>
    currentStep: number
    currentStepText: string
    realStepsCount: number
    isFirstCount: boolean
    isLastCount: boolean
    isFirstStep: boolean
    isLastStep: boolean
    goTo: (index: number) => void
    next: () => void
    back: () => void
    contentVisibleHeight?: number
}
const MultiStepFormContext = createContext<MultiStepFormProviderValue | null>(null);

interface MultiStepFormProviderProps {
    children: ReactNode | null
    steps: Steps
    resultStep?: ResultStep
    isFirstCount?: boolean
    control: Control<any>
    submitHandler:  (e?: (React.BaseSyntheticEvent<object, any, any> | undefined)) => Promise<void>
    trigger: UseFormTrigger<any>
    resetField?: UseFormResetField<any>
    contentVisibleAreaHeight?: number
}

export const MultiStepFormProvider: React.FC<MultiStepFormProviderProps> = ({
    children,
    steps,
    resultStep,
    isFirstCount = true,
    control,
    submitHandler,
    trigger,
    resetField,
    contentVisibleAreaHeight
}) => {
    const [formSteps, setFormSteps] = useState<Steps>(steps);
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        if(!resultStep || formSteps[formSteps.length - 1] == resultStep) return;

        setFormSteps(prevState => [...prevState, resultStep]);
    }, []);

    const isFirstStep = () => currentStep === 0;

    const isLastStep = () => currentStep >= formSteps.length - 1;

    const next = async () => {
        if(isLastStep()) {
            await submitHandler();
            return;
        }

        const currentStepFields = formSteps[currentStep]?.fields;
        if(currentStepFields && currentStepFields.length > 0) {
            const isValid = await trigger(currentStepFields);
            if(!isValid) return;
        }

        Keyboard.dismiss();
        setCurrentStep(prevState => ++prevState);
    }

    const back = () => {
        if(isFirstStep()) return;

        Keyboard.dismiss();
        setCurrentStep(prevState => --prevState);
    }

    const goTo = (index: number) => {
        if(index < 0 || index >= formSteps.length) return;
        setCurrentStep(index);
    }

    const getCurrentStepText = () =>
        (currentStep + (isFirstCount ? 1 : 0)).toString();

    const getRealStepsCount = () =>
        (formSteps.length - (!isFirstCount ? 1 : 0) - (!!resultStep ? 1 : 0));

    return (
        <MultiStepFormContext.Provider
            value={{
                steps: formSteps,
                control,
                submitHandler,
                trigger,
                resetField,
                currentStep,
                currentStepText: getCurrentStepText(),
                realStepsCount: getRealStepsCount(),
                isFirstCount,
                isLastCount: !resultStep,
                isFirstStep: isFirstStep(),
                isLastStep: isLastStep(),
                goTo,
                next,
                back,
                contentVisibleHeight: contentVisibleAreaHeight
            }}
        >
            { children }
        </MultiStepFormContext.Provider>
    )
}

export const useMultiStepForm = () => useContext<MultiStepFormProviderValue>(MultiStepFormContext as Context<MultiStepFormProviderValue>);