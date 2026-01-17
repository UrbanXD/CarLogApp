import { useForm } from "react-hook-form";
import { PlaceFormFields, useCreatePlaceFormProps } from "../schemas/form/placeForm.ts";
import { useAlert } from "../../../../../ui/alert/hooks/useAlert.ts";
import { useDatabase } from "../../../../../contexts/database/DatabaseContext.ts";
import { useBottomSheet } from "../../../../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import { getUUID } from "../../../../../database/utils/uuid.ts";
import { CreateToast, InvalidFormToast } from "../../../../../ui/alert/presets/toast/index.ts";
import { useTranslation } from "react-i18next";
import { SubmitHandlerArgs } from "../../../../../types/index.ts";

type UseCreatePlaceProps = {
    userId: string,
    dismissSheet?: boolean
}

export function useCreatePlace({ userId, dismissSheet = true }: UseCreatePlaceProps) {
    const { t } = useTranslation();
    const { openToast } = useAlert();
    const { placeDao } = useDatabase();
    const { dismissBottomSheet } = useBottomSheet();

    const form = useForm<PlaceFormFields>(useCreatePlaceFormProps(placeDao, userId));

    const submitHandler = (onDone?: () => void): SubmitHandlerArgs<PlaceFormFields> => ({
        onValid: async (formResult) => {
            try {
                await placeDao.create(formResult);
                openToast(CreateToast.success(t("places.title_singular")));

                onDone?.();
                form.reset({ id: getUUID(), name: "", ownerId: userId });

                if(dismissBottomSheet && dismissSheet) dismissBottomSheet(true);
            } catch(e) {
                openToast(CreateToast.error(t("places.title_singular")));
                console.error("Hiba a submitHandler-ben place form:", e);
            }
        },
        onInvalid: (errors) => {
            console.log("Place form validation errors", errors);
            openToast(InvalidFormToast.warning());
        }
    });

    return { form, submitHandler };
}