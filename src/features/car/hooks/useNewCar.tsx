import { AddCarFormFieldType, useAddCarFormProps } from "../schemas/carSchema.ts";
import { useAlert } from "../../../ui/alert/contexts/AlertContext.ts";
import { useForm } from "react-hook-form";
import useCarSteps from "./useCarSteps.tsx";
import { CarCreateToast } from "../presets/toast/index.ts";
import { useBottomSheet } from "../../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import { useDatabase } from "../../../contexts/database/DatabaseContext.ts";
import { store } from "../../../database/redux/store.ts";
import { addCar } from "../model/actions/addCar.ts";

const useNewCarForm = () => {
    const database = useDatabase();
    const { dismissAllBottomSheet } = useBottomSheet();
    const { addToast } = useAlert();

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
                addToast(CarCreateToast.success());
            } catch(e) {
                console.log(e);
                addToast(CarCreateToast.error());
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