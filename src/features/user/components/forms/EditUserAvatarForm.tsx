import React from "react";
import { editUserAvatar } from "../../model/actions/editUserAvatar.ts";
import { EditUserAvatarRequest, useEditUserAvatarFormProps } from "../../schemas/form/editUserAvatarRequest.ts";
import { useForm } from "react-hook-form";
import { useAlert } from "../../../../ui/alert/hooks/useAlert.ts";
import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import { useAppDispatch } from "../../../../hooks/index.ts";
import { UserAccount } from "../../schemas/userSchema.ts";
import { ChangeNameToast } from "../../presets/toast/index.ts";
import { router } from "expo-router";
import { getToastMessage } from "../../../../ui/alert/utils/getToastMessage.ts";
import { AvatarStep } from "./steps/AvatarStep.tsx";
import Form from "../../../../components/Form/Form.tsx";
import { FormButtons } from "../../../../components/Button/presets/FormButtons.tsx";

type EditUserAvatarFormProps = { user: UserAccount }

export function EditUserAvatarForm({ user }: EditUserAvatarFormProps) {
    const dispatch = useAppDispatch();
    const database = useDatabase();
    const { openToast } = useAlert();

    const form = useForm<EditUserAvatarRequest>(useEditUserAvatarFormProps({
        avatar: user.avatar,
        avatarColor: user.avatarColor
    }));
    const { handleSubmit, reset } = form;

    const submitHandler = handleSubmit(async (request: EditUserAvatarRequest) => {
        try {
            await dispatch(editUserAvatar({ database, request: { ...request } }));

            openToast(ChangeNameToast.success());
            router.dismissTo("(profile)/user");
        } catch(error) {
            openToast(getToastMessage({ messages: ChangeNameToast, error }));
        }
    });

    return (
        <Form>
            <AvatarStep { ...form } />
            <FormButtons reset={ reset } submit={ submitHandler }/>
        </Form>
    );
}