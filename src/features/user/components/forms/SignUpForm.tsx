import React from "react";
import MultiStepForm from "../../../../components/Form/MultiStepForm.tsx";
import { useSignUpSteps } from "../../hooks/useSignUpSteps.tsx";
import { FormState, useForm } from "react-hook-form";
import { useAuth } from "../../../../contexts/auth/AuthContext.ts";
import { SignUpRequest, useSignUpFormProps } from "../../schemas/form/signUpRequest.ts";
import { SubmitHandlerArgs } from "../../../../types";

type SignUpFormProps = {
    onFormStateChange?: (formState: FormState<SignUpRequest>) => void
}

function SignUpForm({ onFormStateChange }: SignUpFormProps) {
    const form = useForm<SignUpRequest>(useSignUpFormProps());
    const { signUp } = useAuth();

    const submitHandler: SubmitHandlerArgs<SignUpRequest> = {
        onValid: signUp
    };

    return (
        <MultiStepForm
            form={ form }
            steps={ useSignUpSteps(form) }
            isFirstCount={ false }
            submitHandler={ submitHandler }
            onFormStateChange={ onFormStateChange }
        />
    );
}

export default SignUpForm;