import { useForm } from "react-hook-form";
import { PlaceFormFields, useCreatePlaceFormProps } from "../schemas/form/placeForm.ts";
import { useAlert } from "../../../../../ui/alert/hooks/useAlert.ts";
import { useDatabase } from "../../../../../contexts/database/DatabaseContext.ts";
import { useBottomSheet } from "../../../../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import { getUUID } from "../../../../../database/utils/uuid.ts";
import { CreateToast, InvalidFormToast } from "../../../../../ui/alert/presets/toast/index.ts";

type UseCreatePlaceProps = {
    userId: string,
    dismissSheet?: boolean
}

export function useCreatePlace({ userId, dismissSheet = true }: UseCreatePlaceProps) {
    const { openToast } = useAlert();
    const { placeDao } = useDatabase();
    const { dismissBottomSheet } = useBottomSheet();

    const form = useForm<PlaceFormFields>(useCreatePlaceFormProps(placeDao, userId));
    const { handleSubmit, reset } = form;

    const submitHandler = (onDone?: () => void) =>
        handleSubmit(
            async (formResult: PlaceFormFields) => {
                try {
                    await placeDao.create(formResult);

                    openToast(CreateToast.success(t("places.title_singular")));

                    onDone?.();
                    reset({ id: getUUID(), name: "", ownerId: userId });

                    if(dismissBottomSheet && dismissSheet) dismissBottomSheet(true);
                } catch(e) {
                    openToast(CreateToast.error(t("places.title_singular")));
                    console.error("Hiba a submitHandler-ben place form:", e);
                }
            },
            (errors) => {
                console.log("Place form validation errors", errors);
                openToast(InvalidFormToast.warning());
            }
        );

    return { form, submitHandler };
}