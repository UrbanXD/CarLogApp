import { CarFormFieldType, useCarFormProps } from "../../../constants/schemas/carSchema";
import { store } from "../../../../Database/redux/store";
import { addCar } from "../../../../Database/redux/cars/functions/addCar";
import { useDatabase } from "../../../../Database/connector/Database";
import { useAlert } from "../../../../Alert/context/AlertProvider";
import { useForm } from "react-hook-form";
import newCarToast from "../../../../Alert/layouts/toast/newCarToast";
import useCarSteps from "../steps/useCarSteps";

const useNewCarForm = (
    forceCloseBottomSheet: () => void
) => {
    const database = useDatabase();
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

                //ha sikeres a hozzaadas
                reset();
                forceCloseBottomSheet();
                addToast(newCarToast.success);
            } catch (e){
                console.log(e);
                //ha sikertelen
                addToast(newCarToast.error);
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