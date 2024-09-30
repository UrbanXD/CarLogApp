import { ReactNode, useState } from "react";

interface useMultiStepFormArgs {
    steps: Array<() => ReactNode | null>
}

export const useMultiStepForm = ({ steps }: useMultiStepFormArgs) => {
    const [currentStep, setCurrentStep] = useState(0);

    const next = () => {
        setCurrentStep(i => {
            if (i >= steps.length - 1) return i;
            return i + 1;
        })
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

    return {
        currentStep,
        step: steps[currentStep],
        steps,
        isFirstStep: currentStep === 0,
        isLastStep: currentStep === steps.length - 1,
        goTo,
        next,
        back,
    }
}