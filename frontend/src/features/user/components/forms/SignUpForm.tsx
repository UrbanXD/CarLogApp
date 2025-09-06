import React from "react";
import MultiStepForm from "../../../../components/Form/MultiStepForm.tsx";
import { useSignUpSteps } from "../../hooks/useSignUpSteps.tsx";
import { useForm } from "react-hook-form";
import { SignUpRequest, useSignUpFormProps } from "../../schemas/signUpRequestSchema.ts";
import { useAuth } from "../../../auth/contexts/AuthContext.ts";

const SignUpForm: React.FC = () => {
    const { signUp } = useAuth();
    const {
        control,
        handleSubmit,
        trigger,
        resetField
    } = useForm<SignUpRequest>(useSignUpFormProps());

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