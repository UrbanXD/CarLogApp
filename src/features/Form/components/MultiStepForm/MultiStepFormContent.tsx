import React from "react";
import { useMultiStepForm } from "../../context/MultiStepFormProvider";
import OnBoardingView from "../../../../components/OnBoardingView";

const MultiStepFormContent: React.FC = () => {
    const {
        steps,
        currentStep,
        contentVisibleHeight
    } = useMultiStepForm();

    return (
        <OnBoardingView
            steps={ steps }
            currentStep={ currentStep }
            visibleHeight={ contentVisibleHeight }
        />
    )
}

export default MultiStepFormContent;