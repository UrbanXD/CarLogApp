import React, {Context, createContext, ReactNode, useContext, useEffect, useState} from "react";
import {Control, SubmitHandler, UseFormHandleSubmit, UseFormTrigger} from "react-hook-form";
import {registerStepsField} from "../constants/formSchema/registerForm";

interface MultiStepFormProviderValue {
    steps: Array<() => ReactNode | null>
    control: Control<any>
    submitHandler: SubmitHandler<any>
    trigger: UseFormTrigger<any>
    currentStep: number
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
    control: Control<any>
    submitHandler: SubmitHandler<any>
    trigger: UseFormTrigger<any>
}

export const MultiStepFormProvider: React.FC<MultiStepFormProviderProps> = ({ children, steps, control, submitHandler, trigger}) => {
    const [currentStep, setCurrentStep] = useState(0);

    const next = async () => {
        if (currentStep >= steps.length - 1) return

        const isValid = await trigger(registerStepsField[currentStep]);
        console.log(isValid)
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
                control,
                submitHandler,
                trigger,
                currentStep,
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