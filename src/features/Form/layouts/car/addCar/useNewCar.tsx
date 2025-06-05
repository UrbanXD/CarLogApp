import { useAddCarFormProps, AddCarFormFieldType } from "../../../constants/schemas/carSchema";
import { store } from "../../../../Database/redux/store";
import { addCar } from "../../../../Database/redux/cars/functions/addCar";
import { useDatabase } from "../../../../Database/connector/Database";
import { useAlert } from "../../../../Alert/context/AlertProvider";
import { useForm } from "react-hook-form";
import useCarSteps from "../steps/useCarSteps";
import { NewCarToast } from "../../../../Alert/presets/toast";
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
        steps: useCarSteps(control, resetField)
    }
}

export default useNewCarForm;