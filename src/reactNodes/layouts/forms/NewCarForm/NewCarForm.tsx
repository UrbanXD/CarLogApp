import React from "react";
import {useForm} from "react-hook-form";
import {
    getNewCarHandleSubmit,
    NewCarFormFieldType,
    newCarUseFormProps
} from "../../../../constants/formSchema/newCarForm";
import {useDatabase} from "../../../../db/Database";
import {View} from "react-native";

import {GLOBAL_STYLE} from "../../../../constants/constants";
import InputText from "../../../../components/Input/InputText";
import Button from "../../../../components/Button/Button";
import {useBottomSheetModal} from "@gorhom/bottom-sheet";

const NewCarForm: React.FC = () => {
    const { control, handleSubmit, reset } =
        useForm<NewCarFormFieldType>(newCarUseFormProps);
    const { supabaseConnector, db } = useDatabase();
    const { dismiss } = useBottomSheetModal();
    const onSubmit = (isSuccess?: boolean) => {
        if(isSuccess){
            reset();
            dismiss();
        } else{
            console.log("HIBA NEW CAR FORM")
        }
    }

    const submitHandler = getNewCarHandleSubmit({ handleSubmit, supabaseConnector, db, onSubmit });

    return (
        <View style={ [GLOBAL_STYLE.formContainer, { justifyContent: "flex-start" }] }>
            <InputText
                control={ control }
                fieldName="name"
            />
            <InputText
                control={ control }
                fieldName="brand"
            />
            <InputText
                control={ control }
                fieldName="type"
            />
            <Button onPress={ submitHandler } title={"Hozzaad"} />
        </View>
    )
}


export default NewCarForm;