import { useAlert } from "../../../../../../ui/alert/hooks/useAlert.ts";
import { useDatabase } from "../../../../../../contexts/database/DatabaseContext.ts";
import { FormState, useForm } from "react-hook-form";
import { PassengerFormFields, useEditPassengerFormProps } from "../../schemas/form/passengerForm.ts";
import Form from "../../../../../../components/Form/Form.tsx";
import React from "react";
import Input from "../../../../../../components/Input/Input.ts";
import { useBottomSheet } from "../../../../../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import { Passenger } from "../../schemas/passengerSchema.ts";
import { useTranslation } from "react-i18next";
import { EditToast, InvalidFormToast } from "../../../../../../ui/alert/presets/toast/index.ts";
import { SubmitHandlerArgs } from "../../../../../../types/index.ts";

type EditPassengerFormProps = {
    passenger: Passenger
    onFormStateChange?: (formState: FormState<PassengerFormFields>) => void
}

export function EditPassengerForm({ passenger, onFormStateChange }: EditPassengerFormProps) {
    const { t } = useTranslation();
    const { openToast } = useAlert();
    const { passengerDao } = useDatabase();
    const { dismissBottomSheet } = useBottomSheet();

    const form = useForm<PassengerFormFields>(useEditPassengerFormProps(passengerDao, passenger));

    const submitHandler: SubmitHandlerArgs<PassengerFormFields> = {
        onValid: async (formResult) => {
            try {
                await passengerDao.update(formResult);
                openToast(EditToast.success());

                if(dismissBottomSheet) dismissBottomSheet(true);
            } catch(e) {
                openToast(EditToast.error());
                console.error("Hiba a submitHandler-ben passenger form:", e);
            }
        },
        onInvalid: (errors) => {
            console.log("Edit passenger form validation errors", errors);
            openToast(InvalidFormToast.warning());
        }
    };

    return (
        <Form
            edit
            form={ form }
            formFields={
                <Input.Field
                    control={ form.control }
                    fieldName={ "name" }
                    fieldNameText={ t("passengers.title_singular") }
                >
                    <Input.Text placeholder={ t("passengers.title_singular") }/>
                </Input.Field>
            }
            submitHandler={ submitHandler }
            onFormStateChange={ onFormStateChange }
        />
    );
}