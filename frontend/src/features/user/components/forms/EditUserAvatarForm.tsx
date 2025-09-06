import { useAlert } from "../../../../ui/alert/hooks/useAlert.ts";
import { useForm } from "react-hook-form";
import { User } from "../../schemas/userSchema.tsx";
import EditForm from "../../../../components/Form/EditForm.tsx";
import { NameStep } from "./steps/index.ts";
import { router } from "expo-router";
import { getToastMessage } from "../../../../ui/alert/utils/getToastMessage.ts";
import { editUserName } from "../../model/actions/editUserName.ts";
import { ChangeNameToast } from "../../presets/toast/index.ts";
import { useAppDispatch } from "../../../../hooks/index.ts";
import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import { EditUserAvatarRequest, useEditUserAvatarFormProps } from "../../schemas/editUserAvatarRequest.ts";


type EditUserAvatarFormProps = {
    user: User
}

export function EditUserAvatarForm({ user }: EditUserAvatarFormProps) {
    const dispatch = useAppDispatch();
    const database = useDatabase();
    const { openToast } = useAlert();

    const {
        control,
        handleSubmit,
        reset
    } = useForm<EditUserAvatarRequest>(useEditUserAvatarFormProps({
        avatar: user.avatar,
        avatarColor: user.avatarColor
    }));
    const submitHandler = handleSubmit(async (request: EditUserAvatarRequest) => {
        try {
            // let newUserAvatar: Image | null = user?.userAvatar ?? null;
            // if(newUser?.avatarImage && user?.userAvatar?.path !== getPathFromImageType(newUser.avatarImage, user?.id)) {
            //     const newAvatarImage = await attachmentQueue.saveFile(newUser.avatarImage, user.id);
            //     newUserAvatar = getImageState(newAvatarImage.filename, newUser.avatarImage.buffer);
            // } TODO: maga a lementest queue ba a daoba kellene kezelni vagy legalabb is az editUserAvatarba

            await dispatch(editUserName({ database, request: { ...request } }));

            openToast(ChangeNameToast.success());
            router.dismissTo("(profile)/user");
        } catch(error) {
            openToast(
                getToastMessage({
                    messages: ChangeNameToast,
                    error
                })
            );
        }
    });

    return (
        <EditForm
            renderInputFields={ () => <NameStep control={ control }/> }
            submitHandler={ submitHandler }
            reset={ reset }
        />
    );
}