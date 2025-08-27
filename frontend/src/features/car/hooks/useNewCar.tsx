import { AddCarFormFieldType, useAddCarFormProps } from "../schemas/carSchema.ts";
import { useForm } from "react-hook-form";
import useCarSteps from "./useCarSteps.tsx";
import { useDatabase } from "../../../contexts/database/DatabaseContext.ts";
import { addCar } from "../model/actions/addCar.ts";
import { useAlert } from "../../../ui/alert/hooks/useAlert.ts";
import { CarCreateToast } from "../presets/toast/index.ts";
import { useBottomSheet } from "../../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import { useAppDispatch } from "../../../hooks/index.ts";

const useNewCarForm = () => {
    const database = useDatabase();
    const dispatch = useAppDispatch();
    const { openToast } = useAlert();
    const { dismissBottomSheet } = useBottomSheet();

    const {
        control,
        handleSubmit,
        trigger,
        reset,
        resetField,
        getValues
    } = useForm<AddCarFormFieldType>(useAddCarFormProps());

    const submitHandler =
        handleSubmit(async (newCar: AddCarFormFieldType) => {
            try {
                await dispatch(addCar({ database, car: newCar }));

                reset();
                if(dismissBottomSheet) dismissBottomSheet(true);
                openToast(CarCreateToast.success());
            } catch(e) {
                console.log(e);
                openToast(CarCreateToast.error());
            }
        });

    return {
        control,
        submitHandler,
        trigger,
        resetField,
        steps: useCarSteps(control, resetField, getValues)
    };
};

export default useNewCarForm;