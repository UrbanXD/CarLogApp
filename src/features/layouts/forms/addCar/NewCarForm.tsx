import React, { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
    FUEL_MEASUREMENTS,
    FUEL_TYPES,
    getNewCarHandleSubmit,
    NewCarFormFieldType,
    newCarFormStepsField, newCarFormStepsTitle,
    newCarUseFormProps,
    ODOMETER_MEASUREMENTS
} from "./newCarFormSchema";
import { useDatabase } from "../../../core/utils/database/Database";
import {
    CARS,
    DATA_TRANSFORM_TO_PICKER_DATA,
    ICON_NAMES,
} from "../../../core/constants/constants";
import { useMultiStepForm } from "../../../core/context/MultiStepFormProvider";
import MultiStepForm from "../../../core/components/multiStepForm/MultiStepForm";
import Input from "../../../core/components/input/Input";
import { InputPickerDataType } from "../../../core/components/input/picker/InputPicker";
import {useAlert} from "../../../alert/context/AlertProvider";
import newCarToast from "../../../alert/layouts/toast/newCarToast";

interface NewCarFormProps {
    close: () => void
}

const NewCarForm: React.FC<NewCarFormProps> = ({
    close
}) => {
    const database = useDatabase();
    const { addToast } = useAlert();
    const { control, handleSubmit, trigger, reset, resetField } =
        useForm<NewCarFormFieldType>(newCarUseFormProps);

    const onSubmit = (isSuccess?: boolean) => {
        if(isSuccess){
            reset();
            close();
            addToast(newCarToast.success);
        } else{
            addToast(newCarToast.error);
        }
    }

    const submitHandler = getNewCarHandleSubmit({
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
            <StepThree />,
        () =>
            <StepFour />,
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
        <Input.Text
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
    }, [selectedBrandNameValue, resetField]);

    return (
        <>
            <Input.Picker
                data={ brands }
                control={ control }
                fieldName="brand"
                fieldNameText="Márka"
                withSearchbar
            />
            <Input.Picker
                key={ JSON.stringify(models) }
                data={ models }
                control={ control }
                fieldName="model"
                fieldNameText="Modell"
                withSearchbar
                disabled={ !isBrandSelected }
                disabledText={ "Először válassza ki az autó márkáját!" }
            />
        </>
    )
}

const StepThree: React.FC = () => {
    const { control} = useMultiStepForm();

    return (
        <>
            <Input.Text
                control={ control }
                fieldName="odometerValue"
                fieldNameText="Kilometerora alass"
                placeholder="000.000.000"
                icon={ ICON_NAMES.odometer }
                numeric
            />
            <Input.Picker
                data={ ODOMETER_MEASUREMENTS }
                control={ control }
                fieldName="odometerMeasurement"
                fieldNameText="Mertekegyseg"
                isHorizontal
                isCarousel={ false }
            />
        </>
    )
}

const StepFour: React.FC = () => {
    const { control } = useMultiStepForm();

    return (
        <>
            <Input.Picker
                data={ FUEL_TYPES }
                control={ control }
                fieldName="fuelType"
                fieldNameText="Uzemanyag tipus"
                isHorizontal
                isCarousel={ false }
            />
            <Input.Picker
                data={ FUEL_MEASUREMENTS }
                control={ control }
                fieldName="fuelMeasurement"
                fieldNameText="Uzemanyag mertekegyseg"
                isHorizontal
                isCarousel={ false }
            />
            <Input.Text
                control={ control }
                fieldName="fuelTankSize"
                fieldNameText="Uzemanyag tartaly merete"
                placeholder="000.000.000"
                icon={ ICON_NAMES.odometer }
                numeric
            />
        </>
    )
}

export default NewCarForm;