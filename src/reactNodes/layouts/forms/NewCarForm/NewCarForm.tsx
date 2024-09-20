import React, {useEffect} from "react";
import {useForm} from "react-hook-form";
import {
    getNewCarHandleSubmit,
    NewCarFormFieldType, newCarFormStepsField,
    newCarUseFormProps, ODOMETER_MEASUREMENTS
} from "../../../../constants/formSchema/newCarForm";
import {useDatabase} from "../../../../db/Database";
import {StyleSheet, Text, View} from "react-native";

import {GLOBAL_STYLE, ICON_NAMES, SEPARATOR_SIZES} from "../../../../constants/constants";
import Button from "../../../../components/Button/Button";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";
import {MultiStepFormProvider, useMultiStepForm} from "../../../providers/MultiStepFormProvider";
import {NewCarFormProgressInfo, NewCarFormContent, NewCarFormButtons} from "./NewCarFormProgressInfo";
// @ts-ignore
import Picker, { PickerDataType } from "../../../../components/Input/InputPicker/Picker";
import InputPicker from "../../../../components/Input/InputPicker/InputPicker";
import InputText from "../../../../components/Input/InputText/InputText";
import TextInput from "../../../../components/Input/InputText/TextInput";

interface NewCarFormProps {
    close?: () => void
}

const NewCarForm: React.FC<NewCarFormProps> = ({ close = () => {} }) => {
    const { control, handleSubmit, trigger, reset, setValue } =
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
            <StepThree />,
        () =>
            <StepFour />
    ]

    return (
        <MultiStepFormProvider
            steps={ steps }
            fieldsName={ newCarFormStepsField }
            control={ control }
            submitHandler={ submitHandler }
            trigger={ trigger }
        >
            <View style={ [GLOBAL_STYLE.pageContainer, { justifyContent: "space-between" } ]}>
                <NewCarFormProgressInfo />
                <NewCarFormContent />
                <NewCarFormButtons />
            </View>
        </MultiStepFormProvider>
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
    const { control } = useMultiStepForm();

    return (
        <InputPicker
            data={ [{title: "Merci"}, {title: "Merci"}, {title: "Merci"}, {title: "Merci"}, {title: "Audi"}, {title: "Audi"}, {title: "Audi"},{title: "Audi"},{title: "Audi"}, {title: "xddi"}, {title: "Audi"}, {title: "Opel"}] }
            control={ control }
            fieldName="brand"
            fieldNameText="Márka"
            withSearchbar
        />
    )
}

const StepThree: React.FC = () => {
    const { control } = useMultiStepForm();

    return (
        <InputPicker
            data={ [{title: "A4"}, {title: "A5"}, {title: "Zafira"}] }
            control={ control }
            fieldName={"model"}
            fieldNameText="Modell"
            isHorizontal
        />
    )
}

const StepFour: React.FC = () => {
    const {control} = useMultiStepForm();

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
            />
        </>
    )
}

const styles = StyleSheet.create({
    dropdownButtonStyle: {
        width: 200,
        height: 50,
        backgroundColor: 'red',
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    dropdownButtonTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: '#151E26',
    },
    dropdownButtonArrowStyle: {
        fontSize: 28,
    },
    dropdownButtonIconStyle: {
        fontSize: 28,
        marginRight: 8,
    },
    dropdownMenuStyle: {
        backgroundColor: '#E9ECEF',
        borderRadius: 8,
    },
    dropdownItemStyle: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
    },
    dropdownItemTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: '#151E26',
    },
    dropdownItemIconStyle: {
        fontSize: 28,
        marginRight: 8,
    },
});

export default NewCarForm;