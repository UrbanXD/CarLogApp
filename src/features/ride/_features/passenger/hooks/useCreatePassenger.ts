import { useForm } from "react-hook-form";
import { PassengerFormFields, useCreatePassengerFormProps } from "../schemas/form/passengerForm.ts";
import { useAlert } from "../../../../../ui/alert/hooks/useAlert.ts";
import { useDatabase } from "../../../../../contexts/database/DatabaseContext.ts";
import { useBottomSheet } from "../../../../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import { getUUID } from "../../../../../database/utils/uuid.ts";
import { CreateToast, InvalidFormToast } from "../../../../../ui/alert/presets/toast/index.ts";
import { useTranslation } from "react-i18next";
import { SubmitHandlerArgs } from "../../../../../types/index.ts";

type UseCreatePassengerProps = {
    userId: string
    dismissSheet?: boolean
}

export function useCreatePassenger({ userId, dismissSheet = true }: UseCreatePassengerProps) {
    const { t } = useTranslation();
    const { openToast } = useAlert();
    const { passengerDao } = useDatabase();
    const { dismissBottomSheet } = useBottomSheet();

    const form = useForm<PassengerFormFields>(useCreatePassengerFormProps(passengerDao, userId));

    const submitHandler = (onDone?: () => void): SubmitHandlerArgs<PassengerFormFields> => ({
        onValid: async (formResult) => {
            try {
                await passengerDao.create(formResult);
                openToast(CreateToast.success(t("passengers.title_singular")));

                onDone?.();
                form.reset({ id: getUUID(), name: "", ownerId: userId });

                if(dismissBottomSheet && dismissSheet) dismissBottomSheet(true);
            } catch(e) {
                openToast(CreateToast.error(t("passengers.title_singular")));
                console.error("Hiba a submitHandler-ben passenger form:", e);
            }
        },
        onInvalid: (errors) => {
            console.log("Passenger form validation errors", errors);
            openToast(InvalidFormToast.warning());
        }
    });

    return { form, submitHandler };
}