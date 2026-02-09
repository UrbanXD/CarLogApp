import Form from "../../../../../../components/Form/Form.tsx";
import React from "react";
import Input from "../../../../../../components/Input/Input.ts";
import { useCreatePlace } from "../../hooks/useCreatePlace.ts";
import { useTranslation } from "react-i18next";
import { FormState } from "react-hook-form";
import { PassengerFormFields } from "../../../passenger/schemas/form/passengerForm.ts";
import { useAuth } from "../../../../../../contexts/auth/AuthContext.ts";

type CreatePlaceFormProps = {
    onFormStateChange?: (formState: FormState<PassengerFormFields>) => void
}

export function CreatePlaceForm({ onFormStateChange }: CreatePlaceFormProps) {
    const { t } = useTranslation();
    const { sessionUserId } = useAuth();
    if(!sessionUserId) return null;

    const { form, submitHandler } = useCreatePlace({ userId: sessionUserId });

    return (
        <Form
            form={ form }
            formFields={
                <Input.Field control={ form.control } fieldName={ "name" } fieldNameText={ t("places.title_singular") }>
                    <Input.Text placeholder={ t("places.title_singular") }/>
                </Input.Field>
            }
            submitHandler={ submitHandler() }
            onFormStateChange={ onFormStateChange }
        />
    );
}