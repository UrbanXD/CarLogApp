import React, { Context, createContext, ReactNode, useContext, useState} from "react";
import { Control, SubmitHandler, UseFormResetField, UseFormTrigger } from "react-hook-form";
import { Steps } from "../constants/types/types.ts";

interface MultiStepFormProviderValue {
    steps: Steps
    stepsCount: number
    control: Control<any>
    submitHandler: SubmitHandler<any>
    trigger: UseFormTrigger<any>
    resetField?: UseFormResetField<any>
    currentStep: number
    currentStepText: string
    isFirstCount
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
    optionalSteps?: Array<() => ReactNode | null>
    resultStep?: (args: any) => ReactNode | null
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
    isFirstCount = true,
    control,
    submitHandler,
    trigger,
    resetField,
    contentVisibleAreaHeight
}) => {
    const [currentStep, setCurrentStep] = useState(0);

    const next = async () => {
        if(currentStep >= steps.length - 1) {
            await submitHandler();
            return;
        }

        const isValid = await trigger(steps[currentStep].fields);
        if(!isValid) return

        setCurrentStep(currentStep + 1);
    }

    const back = () => {
        setCurrentStep(i => {
            if (i <= 0) return i;
            return i - 1;
        })
    }

    const goTo = (index: number) => {
        setCurrentStep(index);
    }

    return (
        <MultiStepFormContext.Provider
            value={{
                steps,
                stepsCount: steps.length - (!isFirstCount ? 1 : 0),
                control,
                submitHandler,
                trigger,
                resetField,
                currentStep,
                currentStepText: (currentStep + (isFirstCount ? 1 : 0)).toString(),
                isFirstCount,
                isFirstStep: currentStep === 0,
                isLastStep: currentStep === steps.length - 1,
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