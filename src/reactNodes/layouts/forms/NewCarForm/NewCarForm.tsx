import React, {useEffect, useRef, useState} from "react";
import { useForm, useWatch } from "react-hook-form";
import {
    getNewCarHandleSubmit,
    NewCarFormFieldType,
    newCarFormStepsField, newCarFormStepsTitle,
    newCarUseFormProps,
    ODOMETER_MEASUREMENTS
} from "../../../../constants/formSchema/newCarForm";
import { useDatabase } from "../../../../db/Database";
import {
    CARS,
    DATA_TRANSFORM_TO_PICKER_DATA,
    ICON_NAMES,
} from "../../../../constants/constants";
import { useMultiStepForm } from "../../../providers/MultiStepFormProvider";
import InputPicker, { InputPickerDataType } from "../../../../components/Input/InputPicker/InputPicker";
import InputText from "../../../../components/Input/InputText/InputText";
import { MultiStepForm } from "../../../../components/Form/Form";

interface NewCarFormProps {
    close?: () => void
}

const NewCarForm: React.FC<NewCarFormProps> = ({ close = () => {} }) => {
    const { control, handleSubmit, trigger, reset, resetField } =
        useForm<NewCarFormFieldType>(newCarUseFormProps);

    const { supabaseConnector, db } = useDatabase();

    const onSubmit = (isSuccess?: boolean) => {
        if(isSuccess){
            reset();
            close();
        } else{
            console.log("HIBA NEW CAR FORM");
        }
    }

    const submitHandler = getNewCarHandleSubmit({
        handleSubmit,
        supabaseConnector,
        db,
        onSubmit
    });

    const steps = [
        () =>
            <StepOne />,
        () =>
            <StepTwo />,
        () =>
            <StepFour />
    ]

    return (
        <MultiStepForm
            steps={ steps }
            stepsTitle={ newCarFormStepsTitle }
            fieldsName={ newCarFormStepsField }
            control={ control }
            submitHandler={ submitHandler }
            trigger={ trigger }
            resetField={ resetField }
        />
    )
}

const StepOne: React.FC = () => {
    const { control } = useMultiStepForm();

    return (
        <InputText
            control={ control }
            fieldName="name"
            fieldNameText="Autó azonosító"
            fieldInfoText="Az autó elnevezése, azonosítója mely az Ön számára lehet fontos autója azonosításakor."
            placeholder="AA-0000-BB"
            icon={ ICON_NAMES.nametag }
            isInBottomSheet
        />
    )
}

const StepTwo: React.FC = () => {
    const { control, resetField } = useMultiStepForm();

    const [isBrandSelected, setIsBrandSelected] = useState(false);
    const [brands] = useState(DATA_TRANSFORM_TO_PICKER_DATA(Object.keys(CARS)));
    const [models, setModels] = useState<Array<InputPickerDataType>>([]);

    const selectedBrandName = useRef<string>("");

    const selectedBrandNameValue = useWatch({
        control,
        name: "brand"
    });

    useEffect(() => {
        if (selectedBrandName.current !== selectedBrandNameValue && resetField){
            resetField("model", { keepError: true });
            selectedBrandName.current = selectedBrandNameValue;
        }

        setIsBrandSelected(selectedBrandNameValue !== "");
        setModels(DATA_TRANSFORM_TO_PICKER_DATA(CARS[selectedBrandNameValue] || [], "name"));
    }, [selectedBrandNameValue]);

    return (
        <>
            <InputPicker
                data={ brands }
                control={ control }
                fieldName="brand"
                fieldNameText="Márka"
                withSearchbar
            />
            <InputPicker
                key={ JSON.stringify(models) }
                data={ models }
                control={ control }
                fieldName="model"
                fieldNameText="Modell"
                withSearchbar
                disabled={ !isBrandSelected }
            />
        </>
    )
}

const StepFour: React.FC = () => {
    const { control} = useMultiStepForm();

    return (
        <>
            <InputText
                control={ control }
                fieldName="odometer_value"
                fieldNameText="Kilometerora alass"
                placeholder="000.000.000"
                icon={ICON_NAMES.odometer}
                numeric
            />
            <InputPicker
                data={ ODOMETER_MEASUREMENTS }
                control={ control }
                fieldName={"odometer_measurement"}
                fieldNameText="Mertekegyseg"
                isHorizontal
                isCarousel={ false }
            />
        </>
    )
}

export default NewCarForm;