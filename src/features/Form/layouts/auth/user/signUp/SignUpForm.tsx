import React from "react";
import useSignUpForm from "./useSignUpForm.tsx";
import MultiStepForm from "../../../../components/MultiStepForm/MultiStepForm.tsx";
import { SIGN_UP_STEPS_FIELD, SIGN_UP_STEPS_TITLE } from "../../../../constants/schemas/userSchema.tsx";

const SignUpForm: React.FC = () => {
    const {
        control,
        submitHandler,
        trigger,
        resetField,
        steps
    } = useSignUpForm();

    return (
        <MultiStepForm
            steps={ steps }
            isFirstCount={ false }
            stepsTitle={ SIGN_UP_STEPS_TITLE }
            fieldsName={ SIGN_UP_STEPS_FIELD }
            control={ control }
            submitHandler={ submitHandler }
            trigger={ trigger }
            resetField={ resetField }
        />
    )
}

export default SignUpForm;