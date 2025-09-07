import { useAlert } from "../../../../ui/alert/hooks/useAlert.ts";
import { useForm } from "react-hook-form";
import { EditUserNameRequest, useEditUserNameFormProps } from "../../schemas/form/editUserNameRequest.ts";
import { UserAccount } from "../../schemas/userSchema.ts";
import EditForm from "../../../../components/Form/EditForm.tsx";
import { NameStep } from "./steps/index.ts";
import { router } from "expo-router";
import { getToastMessage } from "../../../../ui/alert/utils/getToastMessage.ts";
import { editUserName } from "../../model/actions/editUserName.ts";
import { ChangeNameToast } from "../../presets/toast/index.ts";
import { useAppDispatch } from "../../../../hooks/index.ts";
import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";

export type EditUserNameFormProps = { user: UserAccount }

export function EditUserNameForm({ user }: EditUserNameFormProps) {
    const dispatch = useAppDispatch();
    const database = useDatabase();
    const { openToast } = useAlert();

    const {
        control,
        handleSubmit,
        reset
    } = useForm<EditUserNameRequest>(useEditUserNameFormProps({ firstname: user.firstname, lastname: user.lastname }));

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
        <EditForm
            renderInputFields={ () => <NameStep control={ control }/> }
            submitHandler={ submitHandler }
            reset={ reset }
        />
    );
}