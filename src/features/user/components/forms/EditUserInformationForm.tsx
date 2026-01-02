import { useAlert } from "../../../../ui/alert/hooks/useAlert.ts";
import { FormState, useForm } from "react-hook-form";
import { EditUserInformationRequest, useEditUserInformationFormProps } from "../../schemas/form/editUserInformation.ts";
import { UserAccount } from "../../schemas/userSchema.ts";
import { NameStep } from "./steps/index.ts";
import { router } from "expo-router";
import { getToastMessage } from "../../../../ui/alert/utils/getToastMessage.ts";
import { ChangePersonalInformationToast } from "../../presets/toast/index.ts";
import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import Form from "../../../../components/Form/Form.tsx";
import React from "react";
import { CurrencyInput } from "../../../_shared/currency/components/CurrencyInput.tsx";
import { SubmitHandlerArgs } from "../../../../types/index.ts";
import { InvalidFormToast } from "../../../../ui/alert/presets/toast/index.ts";

export type EditUserInformationFormProps = {
    user: UserAccount
    onFormStateChange?: (formState: FormState<EditUserInformationRequest>) => void
}

export function EditUserInformationForm({ user, onFormStateChange }: EditUserInformationFormProps) {
    const { userDao } = useDatabase();
    const { openToast } = useAlert();

    const form = useForm<EditUserInformationRequest>(useEditUserInformationFormProps({
        firstname: user.firstname,
        lastname: user.lastname,
        currencyId: user.currency.id
    }));

    const submitHandler: SubmitHandlerArgs<EditUserInformationRequest> = {
        onValid: async (request: EditUserInformationRequest) => {
            try {
                await userDao.updateUserInformation(user.id, request);

                openToast(ChangePersonalInformationToast.success());
                router.dismissTo("(profile)/user");
            } catch(error) {
                openToast(getToastMessage({ messages: ChangePersonalInformationToast, error }));
            }
        },
        onInvalid: (errors) => {
            console.log("Edit user information validation errors", errors);
            openToast(InvalidFormToast.warning());
        }
    };

    return (
        <Form
            edit
            form={ form }
            formFields={
                <>
                    <NameStep { ...form } />
                    <CurrencyInput control={ form.control } fieldName={ "currencyId" }/>
                </>
            }
            submitHandler={ submitHandler }
            onFormStateChange={ onFormStateChange }
        />
    );
}