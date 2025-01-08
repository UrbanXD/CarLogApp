import React from "react";
import { useMultiStepForm } from "../../context/MultiStepFormProvider";
import OnBoardingView from "../../../OnBoardingView/OnBoardingView";

const MultiStepFormContent: React.FC = () => {
    const {
        steps,
        currentStep,
    } = useMultiStepForm();

    return (
        <OnBoardingView
            steps={ steps }
            currentStep={ currentStep }
        />
    )
}

export default MultiStepFormContent;