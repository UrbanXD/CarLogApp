import { useAlert } from "../../../../ui/alert/hooks/useAlert.ts";
import { useForm } from "react-hook-form";
import { EditUserNameRequest, useEditUserNameFormProps } from "../../schemas/form/editUserNameRequest.ts";
import { UserAccount } from "../../schemas/userSchema.ts";
import { NameStep } from "./steps/index.ts";
import { router } from "expo-router";
import { getToastMessage } from "../../../../ui/alert/utils/getToastMessage.ts";
import { editUserName } from "../../model/actions/editUserName.ts";
import { ChangeNameToast } from "../../presets/toast/index.ts";
import { useAppDispatch } from "../../../../hooks/index.ts";
import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import Form from "../../../../components/Form/Form.tsx";
import { FormButtons } from "../../../../components/Button/presets/FormButtons.tsx";
import React from "react";

export type EditUserNameFormProps = { user: UserAccount }

export function EditUserNameForm({ user }: EditUserNameFormProps) {
    const dispatch = useAppDispatch();
    const database = useDatabase();
    const { openToast } = useAlert();

    const form = useForm<EditUserNameRequest>(useEditUserNameFormProps({
        firstname: user.firstname,
        lastname: user.lastname
    }));
    const { handleSubmit, reset } = form;

    const submitHandler = handleSubmit(async (request: EditUserNameRequest) => {
        try {
            await dispatch(editUserName({ database, request }));

            openToast(ChangeNameToast.success());
            router.dismissTo("(profile)/user");
        } catch(error) {
            openToast(getToastMessage({ messages: ChangeNameToast, error }));
        }
    });

    return (
        <Form>
            <NameStep { ...form } />
            <FormButtons reset={ reset } submit={ submitHandler }/>
        </Form>
    );
}