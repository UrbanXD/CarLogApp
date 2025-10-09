import { useAppDispatch } from "../../../../../hooks/index.ts";
import { useAlert } from "../../../../../ui/alert/hooks/useAlert.ts";
import { useBottomSheet } from "../../../../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import { useDatabase } from "../../../../../contexts/database/DatabaseContext.ts";
import { OdometerLogFields } from "../schemas/form/odometerLogForm.ts";
import { updateCarOdometer } from "../../../model/slice/index.ts";
import { CarCreateToast } from "../../../presets/toast/index.ts";
import { convertOdometerValueFromKilometer } from "../utils/convertOdometerUnit.ts";
import { UseFormReturn } from "react-hook-form";

export function useEditOdometerLog(handleSubmit: UseFormReturn<OdometerLogFields>["handleSubmit"]) {
    const dispatch = useAppDispatch();
    const { openToast } = useAlert();
    const { dismissBottomSheet } = useBottomSheet();
    const { odometerLogDao } = useDatabase();

    const submitHandler = handleSubmit(
        async (formResult: OdometerLogFields) => {
            try {
                const result = await odometerLogDao.update(formResult);
                const newHighestOdometerValue = await odometerLogDao.getOdometerValueInKmByCarId(result.carId);

                dispatch(updateCarOdometer({
                    carId: result.carId,
                    value: convertOdometerValueFromKilometer(newHighestOdometerValue, result.unit.conversionFactor)
                }));

                openToast(CarCreateToast.success());

                if(dismissBottomSheet) dismissBottomSheet(true);
            } catch(e) {
                openToast(CarCreateToast.error());
                console.error("Hiba a submitHandler-ben log:", e);
            }
        },
        (errors) => {
            console.log("Edit odometer log validation errors", errors);
            openToast(CarCreateToast.error());
        }
    );

    return { submitHandler };
}