import React from "react";
import RegisterScreen from "../../screens/RegisterScreen";
import {KeyboardProvider} from "react-native-keyboard-controller";
import { MultiStepFormProvider } from "../../providers/MultiStepFormProvider";
import {useDatabase} from "../../db/Database";
import {useForm} from "react-hook-form";
import {
    getRegisterHandleSubmit,
    RegisterFormFieldType,
    registerUseFormProps
} from "../../constants/formSchema/registerForm";
import RegisterStepOne from "../../layouts/forms/RegisterForm/StepOne";
import RegisterStepTwo from "../../layouts/forms/RegisterForm/StepTwo";
import RegisterStepThree from "../../layouts/forms/RegisterForm/StepThree";

const Page: React.FC = () => {
    const { supabaseConnector } = useDatabase();
    const { control, handleSubmit, trigger } =
        useForm<RegisterFormFieldType>(registerUseFormProps);

    const submitHandler = getRegisterHandleSubmit({
        handleSubmit,
        supabaseConnector
    });

    const steps = [
        () =>
            <RegisterStepOne />,
        () =>
            <RegisterStepTwo />,
        () =>
            <RegisterStepThree />
    ];

    return (
        <KeyboardProvider>
            <MultiStepFormProvider
                steps={ steps }
                isFirstNotCount={ false }
                control={ control }
                submitHandler={ submitHandler }
                trigger={ trigger }
            >
                <RegisterScreen />
            </MultiStepFormProvider>
        </KeyboardProvider>
    );
}

export default Page;