import { useAlert } from "../../../../../../ui/alert/hooks/useAlert.ts";
import { useDatabase } from "../../../../../../contexts/database/DatabaseContext.ts";
import { useForm } from "react-hook-form";
import { PlaceFormFields, useEditPlaceFormProps } from "../../schemas/form/placeForm.ts";
import { CarCreateToast } from "../../../../../car/presets/toast/index.ts";
import Form from "../../../../../../components/Form/Form.tsx";
import { FormButtons } from "../../../../../../components/Button/presets/FormButtons.tsx";
import React from "react";
import Input from "../../../../../../components/Input/Input.ts";
import { useBottomSheet } from "../../../../../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import { Place } from "../../schemas/placeSchema.ts";
import { useTranslation } from "react-i18next";

type EditPlaceFormProps = {
    place: Place
}

export function EditPlaceForm({ place }: EditPlaceFormProps) {
    const { t } = useTranslation();
    const { openToast } = useAlert();
    const { placeDao } = useDatabase();
    const { dismissBottomSheet } = useBottomSheet();

    const form = useForm<PlaceFormFields>(useEditPlaceFormProps(placeDao, place));
    const { control, handleSubmit, reset } = form;

    const submitHandler = handleSubmit(
        async (formResult: PlaceFormFields) => {
            try {
                await placeDao.update(formResult);

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
            <Input.Field control={ control } fieldName={ "name" } fieldNameText={ t("places.title_singular") }>
                <Input.Text placeholder={ t("places.singular") }/>
            </Input.Field>
            <FormButtons reset={ reset } submit={ submitHandler }/>
        </Form>
    );
}