import React from "react";
import { useMultiStepForm } from "../../contexts/multiStepForm/MultiStepFormContext.ts";
import OnBoardingView from "../OnBoardingView.tsx";
import { RenderComponent } from "../../types/index.ts";

const MultiStepFormContent: React.FC = () => {
    const { steps, currentStep } = useMultiStepForm();

    const stepsList: Array<RenderComponent> = steps.map(step => step.render);

    return (
        <OnBoardingView
            steps={ stepsList }
            currentStep={ currentStep }
        />
    );
};

export default MultiStepFormContent;