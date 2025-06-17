import React from "react";
import useSignUpForm from "./useSignUpForm.tsx";
import MultiStepForm from "../../../../components/MultiStepForm/MultiStepForm.tsx";

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
            control={ control }
            submitHandler={ submitHandler }
            trigger={ trigger }
            resetField={ resetField }
        />
    )
}

export default SignUpForm;