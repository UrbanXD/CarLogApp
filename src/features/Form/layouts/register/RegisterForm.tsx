import React from "react";
import { useDatabase } from "../../../Database/connector/Database";
import { useForm } from "react-hook-form";
import {
    getRegisterHandleSubmit,
    RegisterFormFieldType,
    registerStepsField,
    registerStepsTitle,
    registerUseFormProps
} from "./registerFormSchema";
import { useMultiStepForm } from "../../context/MultiStepFormProvider";
import { GLOBAL_STYLE, ICON_NAMES } from "../../../Shared/constants/constants";
import Button from "../../../Button/components/Button";
import TextDivider from "../../../Shared/components/TextDivider";
import { theme } from "../../../Shared/constants/theme";
import MultiStepForm from "../../components/MultiStepForm/MultiStepForm";
import Input from "../../components/Input/Input";
import {router} from "expo-router";
import {useAlert} from "../../../Alert/context/AlertProvider";
import registerToast from "../../../Alert/layouts/toast/registerToast";

interface RegisterFormProps {
    close: () => void
}

const RegisterForm: React.FC<RegisterFormProps> = ({
    close
}) => {
    const database = useDatabase();
    const { addToast } = useAlert();

    const { control, handleSubmit, trigger } =
        useForm<RegisterFormFieldType>(registerUseFormProps);

    const onSubmit = (isSuccess?: boolean) => {
        if(isSuccess){
            close();
            router.replace("/(main)");
            addToast(registerToast.success);
        } else{
            addToast(registerToast.error);
        }
    }

    const submitHandler = getRegisterHandleSubmit({
        handleSubmit,
        database,
        onSubmit
    });

    const steps = [
        () =>
            <StepOne />,
        () =>
            <StepTwo />,
        () =>
            <StepThree />
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

const StepOne: React.FC = () => {
    const { control, next } = useMultiStepForm();

    return (
        <>
            <Input.Text
                isInBottomSheet
                control={ control }
                fieldName="email"
                fieldNameText="Email cím"
                icon={ ICON_NAMES.email }
                placeholder="carlog@gmail.com"
            />
            <Button.Text
                text="Következő"
                iconRight={ ICON_NAMES.rightArrowHead }
                onPress={ next }
            />
            <TextDivider
                title="vagy"
                color={ theme.colors.gray1 }
                lineHeight={ 1 }
                marginVertical={ GLOBAL_STYLE.formContainer.gap }
            />
            <Button.Google
                onPress={ () => 1 }
            />
        </>
    )
}

const StepTwo: React.FC = () => {
    const { control } = useMultiStepForm()

    return (
        <>
            <Input.Text
                control={ control }
                fieldName="lastname"
                fieldNameText="Vezetéknév"
                icon={ ICON_NAMES.user }
                placeholder="Kovács"
                isInBottomSheet
            />
            <Input.Text
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

const StepThree: React.FC = () => {
    const { control } = useMultiStepForm()

    return (
        <>
            <Input.Text
                control={ control }
                fieldName="password"
                fieldNameText="Jelszó"
                icon={ ICON_NAMES.password }
                placeholder="*****"
                isSecure
                isInBottomSheet

            />
            <Input.Text
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