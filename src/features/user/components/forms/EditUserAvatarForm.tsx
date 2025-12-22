import React from "react";
import { EditUserAvatarRequest, useEditUserAvatarFormProps } from "../../schemas/form/editUserAvatarRequest.ts";
import { FormState, useForm } from "react-hook-form";
import { useAlert } from "../../../../ui/alert/hooks/useAlert.ts";
import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import { useAppDispatch } from "../../../../hooks/index.ts";
import { UserAccount } from "../../schemas/userSchema.ts";
import { ChangePersonalInformationToast } from "../../presets/toast/index.ts";
import { getToastMessage } from "../../../../ui/alert/utils/getToastMessage.ts";
import { AvatarStep } from "./steps/AvatarStep.tsx";
import Form from "../../../../components/Form/Form.tsx";
import { SubmitHandlerArgs } from "../../../../types/index.ts";
import { InvalidFormToast } from "../../../../ui/alert/presets/toast/index.ts";
import { getLabelByName } from "../../../../utils/getLabelByName.ts";
import { router } from "expo-router";
import { editUserAvatar } from "../../model/actions/editUserAvatar.ts";

type EditUserAvatarFormProps = {
    user: UserAccount
    onFormStateChange?: (formState: FormState<EditUserAvatarRequest>) => void
}

export function EditUserAvatarForm({ user, onFormStateChange }: EditUserAvatarFormProps) {
    const dispatch = useAppDispatch();
    const database = useDatabase();
    const { openToast } = useAlert();

    const form = useForm<EditUserAvatarRequest>(useEditUserAvatarFormProps({
        avatar: user.avatar,
        avatarColor: user.avatarColor,
        isImageAvatar: !!user.avatar
    }));

    const submitHandler: SubmitHandlerArgs<EditUserAvatarRequest> = {
        onValid: async (request) => {
            try {
                await dispatch(editUserAvatar({ database, request: request }));

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

    const name = `${ user?.lastname } ${ user?.firstname }`;

    return (
        <Form
            edit
            form={ form }
            formFields={ <AvatarStep form={ form } avatarLabel={ getLabelByName(name) }/> }
            submitHandler={ submitHandler }
            onFormStateChange={ onFormStateChange }
        />
    );
}