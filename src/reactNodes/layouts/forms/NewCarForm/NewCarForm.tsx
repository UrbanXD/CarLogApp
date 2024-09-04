import React, {useEffect} from "react";
import {useForm} from "react-hook-form";
import {
    getNewCarHandleSubmit,
    NewCarFormFieldType,
    newCarUseFormProps
} from "../../../../constants/formSchema/newCarForm";
import {useDatabase} from "../../../../db/Database";
import {StyleSheet, View} from "react-native";

import {GLOBAL_STYLE, ICON_NAMES} from "../../../../constants/constants";
import InputText from "../../../../components/Input/InputText";
import Button from "../../../../components/Button/Button";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";

interface NewCarFormProps {
    close?: () => void
}

const NewCarForm: React.FC<NewCarFormProps> = ({ close = () => {} }) => {
    const { control, handleSubmit, reset, setValue } =
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

    const submitHandler = getNewCarHandleSubmit({ handleSubmit, supabaseConnector, db, onSubmit });

    return (
        <View style={ [GLOBAL_STYLE.pageContainer, { justifyContent: "space-between" } ]}>
            <View style={ [GLOBAL_STYLE.formContainer, { justifyContent: "flex-start" }] }>
                <InputText
                    control={ control }
                    fieldName="name"
                    fieldNameText="Azonosító"
                    placeholder="AA-0000-BB"
                    icon={ ICON_NAMES.user }
                />
                <InputText
                    control={ control }
                    fieldName="brand"
                    fieldNameText="Márka"
                    placeholder="Mercedes"
                    icon={ ICON_NAMES.user }
                />
                <InputText
                    control={ control }
                    fieldName="model"
                    fieldNameText="Modell"
                    placeholder="G-Class"
                    icon={ ICON_NAMES.user }
                />
            </View>
            <View style={{ flex: 1, justifyContent: "flex-end" }}>
                <Button
                    onPress={ submitHandler }
                    title="Létrehozás"
                    width={ wp(75) }
                />
            </View>
        </View>
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