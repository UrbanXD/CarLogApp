import React from "react";
import MultiStepForm from "../../../components/MultiStepForm/MultiStepForm";
import useNewCarForm from "./useNewCar";

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
            steps={ steps }
            control={ control }
            submitHandler={ submitHandler }
            trigger={ trigger }
            resetField={ resetField }
        />
    )
}

export default NewCarForm;