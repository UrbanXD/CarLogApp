import React from "react";
import { useDatabase } from "../../../../db/Database";
import { useForm } from "react-hook-form";
import {
    getRegisterHandleSubmit,
    RegisterFormFieldType,
    registerStepsField,
    registerStepsTitle,
    registerUseFormProps
} from "../../../../constants/formSchema/registerForm";
import { useMultiStepForm } from "../../../providers/MultiStepFormProvider";
import { GLOBAL_STYLE, ICON_NAMES } from "../../../../constants/constants";
import InputText from "../../../../components/Input/InputText/InputText";
import { MultiStepForm } from "../../../../components/Form/Form";
import Button, {FacebookButton, GoogleButton} from "../../../../components/Button/Button";
import TextDivider from "../../../../components/TextDivider/TextDivider";
import { theme } from "../../../../constants/theme";

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
        <MultiStepForm
            steps={ steps }
            stepsTitle={ registerStepsTitle }
            fieldsName={ registerStepsField }
            isFirstCount={ false }
            control={ control }
            submitHandler={ submitHandler }
            trigger={ trigger }
        />
    )
}

const RegisterStepOne: React.FC = () => {
    const { control, next } = useMultiStepForm();

    return (
        <>
            <InputText
                isInBottomSheet
                control={ control }
                fieldName="email"
                fieldNameText="Email cím"
                icon={ ICON_NAMES.email }
                placeholder="carlog@gmail.com"
            />
            <Button
                title="Következő"
                iconRight={ ICON_NAMES.rightArrowHead }
                onPress={ next }
            />
            <TextDivider
                title="vagy"
                color={ theme.colors.gray1 }
                lineHeight={ 1 }
                marginVertical={ GLOBAL_STYLE.formContainer.gap }
            />
            <GoogleButton onPress={ () => 1 } />
            <FacebookButton onPress={ () => 1 } />
        </>
    )
}

const RegisterStepTwo: React.FC = () => {
    const { control } = useMultiStepForm()

    return (
        <>
            <InputText
                control={ control }
                fieldName="lastname"
                fieldNameText="Vezetéknév"
                icon={ ICON_NAMES.user }
                placeholder="Kovács"
                isInBottomSheet
            />
            <InputText
                control={ control }
                fieldName="firstname"
                fieldNameText="Keresztnév"
                icon={ ICON_NAMES.user }
                placeholder="János"
                isInBottomSheet
            />
        </>
    )
}

const RegisterStepThree: React.FC = () => {
    const { control } = useMultiStepForm()

    return (
        <>
            <InputText
                control={ control }
                fieldName="password"
                fieldNameText="Jelszó"
                icon={ ICON_NAMES.password }
                placeholder="*****"
                isSecure
                isInBottomSheet

            />
            <InputText
                control={ control }
                fieldName="rpassword"
                fieldNameText="Jelszó újra"
                icon={ ICON_NAMES.password }
                placeholder="*****"
                isSecure
                isInBottomSheet
            />
        </>
    )
}

export default RegisterForm;