import { useAppSelector } from "../../../../../../hooks/index.ts";
import { getUser } from "../../../../../user/model/selectors/index.ts";
import Form from "../../../../../../components/Form/Form.tsx";
import { FormButtons } from "../../../../../../components/Button/presets/FormButtons.tsx";
import React from "react";
import Input from "../../../../../../components/Input/Input.ts";
import { useCreatePlace } from "../../hooks/useCreatePlace.ts";

export function CreatePlaceForm() {
    const user = useAppSelector(getUser);
    if(!user) return <></>;

    const { form, submitHandler } = useCreatePlace({ userId: user.id });

    return (
        <Form>
            <Input.Field control={ form.control } fieldName={ "name" } fieldNameText={ "Hely" }>
                <Input.Text placeholder={ "Hely" }/>
            </Input.Field>
            <FormButtons submit={ () => submitHandler()() }/>
        </Form>
    );
}