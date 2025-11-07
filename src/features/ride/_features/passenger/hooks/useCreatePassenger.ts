import { useForm } from "react-hook-form";
import { PassengerFormFields, useCreatePassengerFormProps } from "../schemas/form/passengerForm.ts";
import { CarCreateToast } from "../../../../car/presets/toast/index.ts";
import { useAlert } from "../../../../../ui/alert/hooks/useAlert.ts";
import { useDatabase } from "../../../../../contexts/database/DatabaseContext.ts";
import { useBottomSheet } from "../../../../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import { getUUID } from "../../../../../database/utils/uuid.ts";

type UseCreatePassengerProps = {
    userId: string
    dismissSheet?: boolean
}

export function useCreatePassenger({ userId, dismissSheet = true }: UseCreatePassengerProps) {
    const { openToast } = useAlert();
    const { passengerDao } = useDatabase();
    const { dismissBottomSheet } = useBottomSheet();

    const form = useForm<PassengerFormFields>(useCreatePassengerFormProps(passengerDao, userId));
    const { handleSubmit, reset } = form;

    const submitHandler = (onDone?: () => void) =>
        handleSubmit(
            async (formResult: PassengerFormFields) => {
                try {
                    await passengerDao.create(formResult);

                    onDone?.();
                    reset({ id: getUUID(), name: "", ownerId: userId });

                    if(dismissBottomSheet && dismissSheet) dismissBottomSheet(true);
                } catch(e) {
                    openToast(CarCreateToast.error());
                    console.error("Hiba a submitHandler-ben passenger form:", e);
                }
            },
            (errors) => {
                console.log("Passenger form validation errors", errors);
                openToast(CarCreateToast.error());
            }
        );

    return { form, submitHandler };
}