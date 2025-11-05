import { useAlert } from "../../../../../../ui/alert/hooks/useAlert.ts";
import { useDatabase } from "../../../../../../contexts/database/DatabaseContext.ts";
import { useForm } from "react-hook-form";
import { PlaceFormFields, useCreatePlaceFormProps } from "../../schemas/form/placeForm.ts";
import { useAppSelector } from "../../../../../../hooks/index.ts";
import { getUser } from "../../../../../user/model/selectors/index.ts";
import { CarCreateToast } from "../../../../../car/presets/toast/index.ts";
import Form from "../../../../../../components/Form/Form.tsx";
import { FormButtons } from "../../../../../../components/Button/presets/FormButtons.tsx";
import React from "react";
import Input from "../../../../../../components/Input/Input.ts";
import { useBottomSheet } from "../../../../../../ui/bottomSheet/contexts/BottomSheetContext.ts";

export function CreatePlaceForm() {
    const { openToast } = useAlert();
    const { placeDao } = useDatabase();
    const { dismissBottomSheet } = useBottomSheet();
    const user = useAppSelector(getUser);

    if(!user) return <></>;

    const form = useForm<PlaceFormFields>(useCreatePlaceFormProps(placeDao, user.id));
    const { control, handleSubmit } = form;

    const submitHandler = handleSubmit(
        async (formResult: PlaceFormFields) => {
            try {
                await placeDao.create(formResult);

                if(dismissBottomSheet) dismissBottomSheet(true);
            } catch(e) {
                openToast(CarCreateToast.error());
                console.error("Hiba a submitHandler-ben place form:", e);
            }
        },
        (errors) => {
            console.log("Place form validation errors", errors);
            openToast(CarCreateToast.error());
        }
    );

    return (
        <Form>
            <Input.Field control={ control } fieldName={ "name" } fieldNameText={ "Hely" }>
                <Input.Text placeholder={ "Hely" }/>
            </Input.Field>
            <FormButtons submit={ submitHandler }/>
        </Form>
    );
}