import { useAppSelector } from "../../../../../../hooks/index.ts";
import { getUser } from "../../../../../user/model/selectors/index.ts";
import Form from "../../../../../../components/Form/Form.tsx";
import React from "react";
import Input from "../../../../../../components/Input/Input.ts";
import { useCreatePassenger } from "../../hooks/useCreatePassenger.ts";
import { useTranslation } from "react-i18next";
import { FormState } from "react-hook-form";
import { PassengerFormFields } from "../../schemas/form/passengerForm.ts";

type CreatePassengerFormProps = {
    onFormStateChange?: (formState: FormState<PassengerFormFields>) => void
}

export function CreatePassengerForm({ onFormStateChange }: CreatePassengerFormProps) {
    const { t } = useTranslation();
    const user = useAppSelector(getUser);
    if(!user) return <></>;

    const { form, submitHandler } = useCreatePassenger({ userId: user.id });

    return (
        <Form
            form={ form }
            formFields={
                <Input.Field
                    control={ form.control }
                    fieldName={ "name" }
                    fieldNameText={ t("passengers.title_singular") }
                >
                    <Input.Text placeholder={ t("passengers.new") }/>
                </Input.Field>
            }
            submitHandler={ submitHandler() }
            onFormStateChange={ onFormStateChange }
        />
    );
}