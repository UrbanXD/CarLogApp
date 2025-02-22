import { CarFormFieldType, useCarFormProps } from "../../../constants/schemas/carSchema";
import { store } from "../../../../Database/redux/store";
import { addCar } from "../../../../Database/redux/cars/functions/addCar";
import { useDatabase } from "../../../../Database/connector/Database";
import { useAlert } from "../../../../Alert/context/AlertProvider";
import { useForm } from "react-hook-form";
import useCarSteps from "../steps/useCarSteps";
import { NewCarToast } from "../../../../Alert/presets/toast/index.ts";
import { useBottomSheet } from "../../../../BottomSheet/context/BottomSheetContext.ts";

const useNewCarForm = () => {
    const database = useDatabase();
    const { dismissAllBottomSheet } = useBottomSheet();
    const { addToast } = useAlert();

    const {
        control,
        handleSubmit,
        trigger,
        reset,
        resetField
    } = useForm<CarFormFieldType>(useCarFormProps());

    const submitHandler =
        handleSubmit(async (newCar: CarFormFieldType) => {
            try {
                await store.dispatch(addCar({ database, car: newCar }));

                reset();
                dismissAllBottomSheet();
                addToast(NewCarToast.success());
            } catch (e){
                console.log(e);
                addToast(newCarToast.error());
            }
        })

    return {
        control,
        submitHandler,
        trigger,
        resetField,
        steps: useCarSteps(control, resetField)
    }
}

export default useNewCarForm;