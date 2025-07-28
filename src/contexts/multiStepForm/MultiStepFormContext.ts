import { Context, createContext, useContext } from "react";
import { Steps } from "../../types/index.ts";
import { Control, SubmitHandler, UseFormResetField, UseFormTrigger } from "react-hook-form";

type MultiStepFormContextValue = {
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
}

export const MultiStepFormContext = createContext<MultiStepFormContextValue | null>(null);

export const useMultiStepForm = () => useContext<MultiStepFormContextValue>(MultiStepFormContext as Context<MultiStepFormContextValue>);