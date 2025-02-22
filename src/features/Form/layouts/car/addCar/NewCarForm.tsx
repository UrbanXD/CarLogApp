import React from "react";
import MultiStepForm from "../../../components/MultiStepForm/MultiStepForm";
import { CAR_FORM_STEPS_FIELD, CAR_FORM_STEPS_TITLE } from "../../../constants/schemas/carSchema";
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
            stepsTitle={ CAR_FORM_STEPS_TITLE }
            fieldsName={ CAR_FORM_STEPS_FIELD }
            control={ control }
            submitHandler={ submitHandler }
            trigger={ trigger }
            resetField={ resetField }
        />
    )
}

export default NewCarForm;