import { Context, createContext, useContext } from "react";
import { Steps } from "../../types/index.ts";

type MultiStepFormContextValue = {
    steps: Steps
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