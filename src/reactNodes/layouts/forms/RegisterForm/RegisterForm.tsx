import React from "react";
import {useDatabase} from "../../../../db/Database";
import {useForm} from "react-hook-form";
import {
    getRegisterHandleSubmit,
    RegisterFormFieldType,
    registerUseFormProps
} from "../../../../constants/formSchema/registerForm";
import RegisterStepOne from "./StepOne";
import RegisterStepTwo from "./StepTwo";
import RegisterStepThree from "./StepThree";
import {MultiStepFormProvider} from "../../../providers/MultiStepFormProvider";
import RegisterProgressInfo from "./RegisterProgressInfo";
import {GLOBAL_STYLE, SEPARATOR_SIZES} from "../../../../constants/constants";
import {KeyboardAwareScrollView} from "react-native-keyboard-controller";
import RegisterFormContent from "./RegisterFormContent";
import RegisterFormButtons from "./RegisterFormButtons";
import {View} from "react-native";

const RegisterForm: React.FC = () => {
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
        <MultiStepFormProvider
            steps={ steps }
            isFirstNotCount={ false }
            control={ control }
            submitHandler={ submitHandler }
            trigger={ trigger }
        >
            <KeyboardAwareScrollView
                bounces={ false }
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={ false }
                contentContainerStyle={ [GLOBAL_STYLE.scrollViewContentContainer, { paddingTop: SEPARATOR_SIZES.extraMedium }] }
            >
                <RegisterProgressInfo />
                <RegisterFormContent />
            </KeyboardAwareScrollView>
            <RegisterFormButtons />
        </MultiStepFormProvider>
    )
}

export default RegisterForm;