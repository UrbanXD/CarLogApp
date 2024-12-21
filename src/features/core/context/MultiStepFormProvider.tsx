import React, { Context, createContext, ReactNode, useContext, useState} from "react";
import {
    Control,
    SubmitHandler,
    UseFormResetField,
    UseFormTrigger,
} from "react-hook-form";

interface MultiStepFormProviderValue {
    steps: Array<() => ReactNode | null>
    stepsCount: number
    control: Control<any>
    submitHandler: SubmitHandler<any>
    trigger: UseFormTrigger<any>
    resetField?: UseFormResetField<any>
    currentStep: number
    currentStepText: string
    isFirstStep: boolean
    isLastStep: boolean
    goTo: (index: number) => void
    next: () => void
    back: () => void
}
const MultiStepFormContext = createContext<MultiStepFormProviderValue | null>(null);

interface MultiStepFormProviderProps {
    children: ReactNode | null
    steps: Array<() => ReactNode | null>
    fieldsName: Array<Array<string>>
    isFirstCount?: boolean
    control: Control<any>
    submitHandler:  (e?: (React.BaseSyntheticEvent<object, any, any> | undefined)) => Promise<void>
    trigger: UseFormTrigger<any>
    resetField?: UseFormResetField<any>
}

export const MultiStepFormProvider: React.FC<MultiStepFormProviderProps> = ({
    children,
    steps,
    fieldsName,
    isFirstCount = true,
    control,
    submitHandler,
    trigger,
    resetField
}) => {
    const [currentStep, setCurrentStep] = useState(0);

    const next = async () => {
        if(currentStep >= steps.length - 1) {
            await submitHandler();
            return;
        }

        const isValid = await trigger(fieldsName[currentStep]);
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
                isFirstStep: currentStep === 0,
                isLastStep: currentStep === steps.length - 1,
                goTo,
                next,
                back
            }}
        >
            { children }
        </MultiStepFormContext.Provider>
    )
}

export const useMultiStepForm = () => useContext<MultiStepFormProviderValue>(MultiStepFormContext as Context<MultiStepFormProviderValue>);