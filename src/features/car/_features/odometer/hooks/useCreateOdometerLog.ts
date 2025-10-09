import { useAppDispatch } from "../../../../../hooks/index.ts";
import { useDatabase } from "../../../../../contexts/database/DatabaseContext.ts";
import { useAlert } from "../../../../../ui/alert/hooks/useAlert.ts";
import { useBottomSheet } from "../../../../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import { OdometerLogFields } from "../schemas/form/odometerLogForm.ts";
import { updateCarOdometer } from "../../../model/slice/index.ts";
import { CarCreateToast } from "../../../presets/toast/index.ts";
import { UseFormReturn } from "react-hook-form";

export function useCreateOdometerLog(handleSubmit: UseFormReturn<OdometerLogFields, any, any>["handleSubmit"]) {
    const dispatch = useAppDispatch();
    const { openToast } = useAlert();
    const { dismissBottomSheet } = useBottomSheet();
    const { odometerLogDao } = useDatabase();

    const submitHandler = handleSubmit(
        async (formResult: OdometerLogFields) => {
            try {
                const result = await odometerLogDao.create(formResult);
                dispatch(updateCarOdometer({ carId: result.carId, value: result.value }));

                openToast(CarCreateToast.success());

                if(dismissBottomSheet) dismissBottomSheet(true);
            } catch(e) {
                openToast(CarCreateToast.error());
                console.error("Hiba a submitHandler-ben log:", e);
            }
        },
        (errors) => {
            console.log("Create odometer log validation errors", errors);
            openToast(CarCreateToast.error());
        }
    );

    return { submitHandler };
}