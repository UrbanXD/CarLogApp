import { useAppSelector } from "../../../../../../hooks/index.ts";
import { getUser } from "../../../../../user/model/selectors/index.ts";
import Form from "../../../../../../components/Form/Form.tsx";
import { FormButtons } from "../../../../../../components/Button/presets/FormButtons.tsx";
import React from "react";
import Input from "../../../../../../components/Input/Input.ts";
import { useCreatePassenger } from "../../hooks/useCreatePassenger.ts";
import { useTranslation } from "react-i18next";

export function CreatePassengerForm() {
    const { t } = useTranslation();
    const user = useAppSelector(getUser);
    if(!user) return <></>;

    const { form, submitHandler } = useCreatePassenger({ userId: user.id });

    return (
        <Form>
            <Input.Field control={ form.control } fieldName={ "name" } fieldNameText={ t("passengers.title_singular") }>
                <Input.Text placeholder={ t("passengers.new") }/>
            </Input.Field>
            <FormButtons submit={ () => submitHandler()() }/>
        </Form>
    );
}