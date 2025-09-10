import React from "react";
import MultiStepForm from "../../../../components/Form/MultiStepForm.tsx";
import { useSignUpSteps } from "../../hooks/useSignUpSteps.tsx";
import { useForm } from "react-hook-form";
import { useAuth } from "../../../../contexts/auth/AuthContext.ts";
import { SignUpRequest, useSignUpFormProps } from "../../schemas/form/signUpRequest.ts";

const SignUpForm: React.FC = () => {
    const {
        control,
        handleSubmit,
        trigger,
        resetField
    } = useForm<SignUpRequest>(useSignUpFormProps());
    const { signUp } = useAuth();

    const submitHandler = handleSubmit(signUp);

    return (
        <MultiStepForm
            steps={ useSignUpSteps(control) }
            isFirstCount={ false }
            control={ control }
            submitHandler={ submitHandler }
            trigger={ trigger }
            resetField={ resetField }
        />
    );
};

export default SignUpForm;