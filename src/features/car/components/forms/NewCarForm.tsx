import React from "react";
import MultiStepForm from "../../../Form/components/MultiStepForm/MultiStepForm.tsx";
import useNewCarForm from "../../hooks/useNewCar.tsx";

const NewCarForm: React.FC = () => {
    const {
        control,
        submitHandler,
        trigger,
        resetField,
        steps
    } = useNewCarForm();

    return (
        <MultiStepForm
            steps={ steps.steps }
            resultStep={ steps.resultStep }
            control={ control }
            submitHandler={ submitHandler }
            trigger={ trigger }
            resetField={ resetField }
        />
    )
}

export default NewCarForm;