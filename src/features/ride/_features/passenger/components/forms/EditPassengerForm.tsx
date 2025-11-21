import { useAlert } from "../../../../../../ui/alert/hooks/useAlert.ts";
import { useDatabase } from "../../../../../../contexts/database/DatabaseContext.ts";
import { useForm } from "react-hook-form";
import { PassengerFormFields, useEditPassengerFormProps } from "../../schemas/form/passengerForm.ts";
import { CarCreateToast } from "../../../../../car/presets/toast/index.ts";
import Form from "../../../../../../components/Form/Form.tsx";
import { FormButtons } from "../../../../../../components/Button/presets/FormButtons.tsx";
import React from "react";
import Input from "../../../../../../components/Input/Input.ts";
import { useBottomSheet } from "../../../../../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import { Passenger } from "../../schemas/passengerSchema.ts";
import { useTranslation } from "react-i18next";

type EditPassengerFormProps = {
    passenger: Passenger
}

export function EditPassengerForm({ passenger }: EditPassengerFormProps) {
    const { t } = useTranslation();
    const { openToast } = useAlert();
    const { passengerDao } = useDatabase();
    const { dismissBottomSheet } = useBottomSheet();

    const form = useForm<PassengerFormFields>(useEditPassengerFormProps(passengerDao, passenger));
    const { control, handleSubmit, reset } = form;

    const submitHandler = handleSubmit(
        async (formResult: PassengerFormFields) => {
            try {
                await passengerDao.update(formResult);

                if(dismissBottomSheet) dismissBottomSheet(true);
            } catch(e) {
                openToast(CarCreateToast.error());
                console.error("Hiba a submitHandler-ben passenger form:", e);
            }
        },
        (errors) => {
            console.log("Passenger form validation errors", errors);
            openToast(CarCreateToast.error());
        }
    );

    return (
        <Form>
            <Input.Field control={ control } fieldName={ "name" } fieldNameText={ t("passengers.title_singular") }>
                <Input.Text placeholder={ t("passengers.title_singular") }/>
            </Input.Field>
            <FormButtons reset={ reset } submit={ submitHandler }/>
        </Form>
    );
}