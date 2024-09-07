import React from "react";
import {useDatabase} from "../../../../db/Database";
import {useForm} from "react-hook-form";
import {
    getRegisterHandleSubmit,
    RegisterFormFieldType, registerStepsField,
    registerUseFormProps
} from "../../../../constants/formSchema/registerForm";
import {MultiStepFormProvider, useMultiStepForm} from "../../../providers/MultiStepFormProvider";
import RegisterProgressInfo from "./RegisterProgressInfo";
import {GLOBAL_STYLE, ICON_NAMES, SEPARATOR_SIZES} from "../../../../constants/constants";
import {KeyboardAwareScrollView} from "react-native-keyboard-controller";
import RegisterFormContent from "./RegisterFormContent";
import RegisterFormButtons from "./RegisterFormButtons";
import {View} from "react-native";
import InputText from "../../../../components/Input/InputText";

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
            fieldsName={ registerStepsField }
            isFirstCount={ false }
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

const RegisterStepOne: React.FC = () => {
    const { control } = useMultiStepForm();

    return (
        <InputText
            key={ 1 }
            isInBottomSheet={true}
            control={ control }
            fieldName="email"
            fieldNameText="Email cím"
            icon={ ICON_NAMES.email }
            placeholder="carlog@gmail.com"
        />
    )
}

const RegisterStepTwo: React.FC = () => {
    const { control } = useMultiStepForm()

    return (
        <>
            <InputText
                key={ 2 }
                control={ control }
                fieldName="lastname"
                fieldNameText="Vezetéknév"
                icon={ ICON_NAMES.user }
                placeholder="Kovács"
                isInBottomSheet={true}
            />
            <InputText
                key={ 3 }
                control={ control }
                fieldName="firstname"
                fieldNameText="Keresztnév"
                icon={ ICON_NAMES.user }
                placeholder="János"
                isInBottomSheet={true}
            />
        </>
    )
}

const RegisterStepThree: React.FC = () => {
    const { control } = useMultiStepForm()

    return (
        <>
            <InputText
                key={ 4 }
                control={ control }
                fieldName="password"
                fieldNameText="Jelszó"
                icon={ ICON_NAMES.password }
                placeholder={"*****"}
                isSecure={ true }
                isInBottomSheet={true}

            />
            <InputText
                key={ 5 }
                control={ control }
                fieldName="rpassword"
                fieldNameText="Jelszó újra"
                icon={ ICON_NAMES.password }
                placeholder="*****"
                isSecure={ true }
                isInBottomSheet={true}

            />
        </>
    )
}

export default RegisterForm;