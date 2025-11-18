import { useAlert } from "../../../../ui/alert/hooks/useAlert.ts";
import { useForm } from "react-hook-form";
import { EditUserInformationRequest, useEditUserInformationFormProps } from "../../schemas/form/editUserInformation.ts";
import { UserAccount } from "../../schemas/userSchema.ts";
import { NameStep } from "./steps/index.ts";
import { router } from "expo-router";
import { getToastMessage } from "../../../../ui/alert/utils/getToastMessage.ts";
import { editUserInformation } from "../../model/actions/editUserInformation.ts";
import { ChangeNameToast } from "../../presets/toast/index.ts";
import { useAppDispatch } from "../../../../hooks/index.ts";
import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import Form from "../../../../components/Form/Form.tsx";
import { FormButtons } from "../../../../components/Button/presets/FormButtons.tsx";
import React from "react";
import { CurrencyInput } from "../../../_shared/currency/components/CurrencyInput.tsx";

export type EditUserInformationFormProps = { user: UserAccount }

export function EditUserInformationForm({ user }: EditUserInformationFormProps) {
    const dispatch = useAppDispatch();
    const database = useDatabase();
    const { openToast } = useAlert();

    const form = useForm<EditUserInformationRequest>(useEditUserInformationFormProps({
        firstname: user.firstname,
        lastname: user.lastname,
        currency_id: user.currency.id
    }));
    const { handleSubmit, reset } = form;

    const submitHandler = handleSubmit(async (request: EditUserInformationRequest) => {
        try {
            await dispatch(editUserInformation({ database, request }));

            openToast(ChangeNameToast.success());
            router.dismissTo("(profile)/user");
        } catch(error) {
            openToast(getToastMessage({ messages: ChangeNameToast, error }));
        }
    });

    return (
        <Form>
            <NameStep { ...form } />
            <CurrencyInput control={ form.control } fieldName={ "currency_id" }/>
            <FormButtons reset={ reset } submit={ submitHandler }/>
        </Form>
    );
}