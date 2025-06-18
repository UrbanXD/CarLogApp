import React from "react";
import { useMultiStepForm } from "../../contexts/MultiStepFormProvider.tsx";
import OnBoardingView from "../OnBoardingView.tsx";
import { RenderComponent } from "../../../../../types/index.ts";

const MultiStepFormContent: React.FC = () => {
    const {
        steps,
        currentStep,
        contentVisibleHeight,
        goTo
    } = useMultiStepForm();

    const stepsList: Array<RenderComponent> = steps.map(step => {
        if(step?.type === "result") return () => step.render(goTo);
        return step.render;
    });

    return (
        <OnBoardingView
            steps={ stepsList }
            currentStep={ currentStep }
            visibleHeight={ contentVisibleHeight }
        />
    )
}

export default MultiStepFormContent;