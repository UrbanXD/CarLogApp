import { useForm } from "react-hook-form";
import { PlaceFormFields, useCreatePlaceFormProps } from "../schemas/form/placeForm.ts";
import { CarCreateToast } from "../../../../car/presets/toast/index.ts";
import { useAlert } from "../../../../../ui/alert/hooks/useAlert.ts";
import { useDatabase } from "../../../../../contexts/database/DatabaseContext.ts";
import { useBottomSheet } from "../../../../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import { getUUID } from "../../../../../database/utils/uuid.ts";

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

                    onDone?.();
                    reset({ id: getUUID(), name: "", ownerId: userId });

                    if(dismissBottomSheet && dismissSheet) dismissBottomSheet(true);
                } catch(e) {
                    openToast(CarCreateToast.error());
                    console.error("Hiba a submitHandler-ben place form:", e);
                }
            },
            (errors) => {
                console.log("Place form validation errors", errors);
                openToast(CarCreateToast.error());
            }
        );

    return { form, submitHandler };
}