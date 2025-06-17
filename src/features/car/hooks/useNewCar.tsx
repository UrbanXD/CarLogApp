import { useAddCarFormProps, AddCarFormFieldType } from "../schemas/carSchema.ts";
import { store } from "../../Database/redux/store.ts";
import { addCar } from "../../Database/redux/cars/functions/addCar.ts";
import { useDatabase } from "../../Database/connector/Database.ts";
import { useAlert } from "../../Alert/context/AlertProvider.tsx";
import { useForm } from "react-hook-form";
import useCarSteps from "./useCarSteps.tsx";
import { NewCarToast } from "../../Alert/presets/toast/index.ts";
import { useBottomSheet } from "../../BottomSheet/context/BottomSheetContext.ts";

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
                addToast(NewCarToast.success());
            } catch (e){
                console.log(e);
                addToast(NewCarToast.error());
            }
        })

    return {
        control,
        submitHandler,
        trigger,
        resetField,
        steps: useCarSteps(control, resetField, getValues)
    }
}

export default useNewCarForm;