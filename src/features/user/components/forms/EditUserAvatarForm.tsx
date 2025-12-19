import React from "react";
import { editUserAvatar } from "../../model/actions/editUserAvatar.ts";
import { EditUserAvatarRequest, useEditUserAvatarFormProps } from "../../schemas/form/editUserAvatarRequest.ts";
import { FormState, useForm } from "react-hook-form";
import { useAlert } from "../../../../ui/alert/hooks/useAlert.ts";
import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import { useAppDispatch } from "../../../../hooks/index.ts";
import { UserAccount } from "../../schemas/userSchema.ts";
import { ChangePersonalInformationToast } from "../../presets/toast/index.ts";
import { router } from "expo-router";
import { getToastMessage } from "../../../../ui/alert/utils/getToastMessage.ts";
import { AvatarStep } from "./steps/AvatarStep.tsx";
import Form from "../../../../components/Form/Form.tsx";
import { SubmitHandlerArgs } from "../../../../types/index.ts";
import { InvalidFormToast } from "../../../../ui/alert/presets/toast/index.ts";

type EditUserAvatarFormProps = {
    user: UserAccount
    onFormStateChange?: (formState: FormState<EditUserAvatarRequest>) => void
}

export function EditUserAvatarForm({ user }: EditUserAvatarFormProps) {
    const dispatch = useAppDispatch();
    const database = useDatabase();
    const { openToast } = useAlert();

    const form = useForm<EditUserAvatarRequest>(useEditUserAvatarFormProps({
        avatar: user.avatar,
        avatarColor: user.avatarColor
    }));

    const submitHandler: SubmitHandlerArgs<EditUserAvatarRequest> = {
        onValid: async (request: EditUserAvatarRequest) => {
            try {
                await dispatch(editUserAvatar({ database, request: { ...request } }));

                openToast(ChangePersonalInformationToast.success());
                router.dismissTo("(profile)/user");
            } catch(error) {
                openToast(getToastMessage({ messages: ChangePersonalInformationToast, error }));
            }
        },
        onInvalid: (errors) => {
            console.log("Edit user avatar validation errors", errors);
            openToast(InvalidFormToast.warning());
        }
    };

    return (
        <Form
            edit
            form={ form }
            formFields={ <AvatarStep { ...form } /> }
            submitHandler={ submitHandler }
            onFormStateChange={ onFormStateChange }
        />
    );
}