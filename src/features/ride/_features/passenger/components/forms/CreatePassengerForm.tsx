import { useAppSelector } from "../../../../../../hooks/index.ts";
import { getUser } from "../../../../../user/model/selectors/index.ts";
import Form from "../../../../../../components/Form/Form.tsx";
import { FormButtons } from "../../../../../../components/Button/presets/FormButtons.tsx";
import React from "react";
import Input from "../../../../../../components/Input/Input.ts";
import { useCreatePassenger } from "../../hooks/useCreatePassenger.ts";

export function CreatePassengerForm() {
    const user = useAppSelector(getUser);
    if(!user) return <></>;

    const { form, submitHandler } = useCreatePassenger({ userId: user.id });

    return (
        <Form>
            <Input.Field control={ form.control } fieldName={ "name" } fieldNameText={ "Utas" }>
                <Input.Text placeholder={ "Új utas" }/>
            </Input.Field>
            <FormButtons submit={ () => submitHandler()() }/>
        </Form>
    );
}