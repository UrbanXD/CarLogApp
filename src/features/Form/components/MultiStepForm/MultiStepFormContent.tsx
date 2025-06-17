import React from "react";
import { useMultiStepForm } from "../../context/MultiStepFormProvider";
import OnBoardingView from "../../../../components/OnBoardingView";
import { RenderComponent } from "../../constants/types/types.ts";

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