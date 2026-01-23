import { useAlert } from "../../../../../../ui/alert/hooks/useAlert.ts";
import { useDatabase } from "../../../../../../contexts/database/DatabaseContext.ts";
import { FormState, useForm } from "react-hook-form";
import { PlaceFormFields, useEditPlaceFormProps } from "../../schemas/form/placeForm.ts";
import Form from "../../../../../../components/Form/Form.tsx";
import React from "react";
import Input from "../../../../../../components/Input/Input.ts";
import { useBottomSheet } from "../../../../../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import { Place } from "../../schemas/placeSchema.ts";
import { useTranslation } from "react-i18next";
import { EditToast, InvalidFormToast } from "../../../../../../ui/alert/presets/toast";
import { SubmitHandlerArgs } from "../../../../../../types";

type EditPlaceFormProps = {
    place: Place
    onFormStateChange?: (formState: FormState<PlaceFormFields>) => void
}

export function EditPlaceForm({ place, onFormStateChange }: EditPlaceFormProps) {
    const { t } = useTranslation();
    const { openToast } = useAlert();
    const { placeDao } = useDatabase();
    const { dismissBottomSheet } = useBottomSheet();

    const form = useForm<PlaceFormFields>(useEditPlaceFormProps(placeDao, place));

    const submitHandler: SubmitHandlerArgs<PlaceFormFields> = {
        onValid: async (formResult: PlaceFormFields) => {
            try {
                await placeDao.updateFromFormResult(formResult);

                openToast(EditToast.success());

                if(dismissBottomSheet) dismissBottomSheet(true);
            } catch(e) {
                openToast(EditToast.error());
                console.error("Hiba a submitHandler-ben place form:", e);
            }
        },
        onInvalid: (errors) => {
            console.log("Place form validation errors", errors);
            openToast(InvalidFormToast.warning());
        }
    };

    return (
        <Form
            edit
            form={ form }
            formFields={
                <Input.Field control={ form.control } fieldName={ "name" } fieldNameText={ t("places.title_singular") }>
                    <Input.Text placeholder={ t("places.title_singular") }/>
                </Input.Field>
            }
            submitHandler={ submitHandler }
            onFormStateChange={ onFormStateChange }
        />
    );
}