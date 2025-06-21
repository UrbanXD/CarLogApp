import { AddCarFormFieldType, useAddCarFormProps } from "../schemas/carSchema.ts";
import { useForm } from "react-hook-form";
import useCarSteps from "./useCarSteps.tsx";
import { useBottomSheet } from "../../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import { useDatabase } from "../../../contexts/database/DatabaseContext.ts";
import { store } from "../../../database/redux/store.ts";
import { addCar } from "../model/actions/addCar.ts";
import { useAlert } from "../../../ui/alert/hooks/useAlert.ts";
import { CarCreateToast } from "../presets/toast/index.ts";

const useNewCarForm = () => {
    const database = useDatabase();
    const { dismissAllBottomSheet } = useBottomSheet();
    const { openToast } = useAlert();

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
                await store.dispatch(addCar({ database, car: newCar }));

                reset();
                dismissAllBottomSheet();
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