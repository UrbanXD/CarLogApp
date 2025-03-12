import { CarFormFieldType, useCarFormProps } from "../../../constants/schemas/carSchema";
import { useForm } from "react-hook-form";
import { store } from "../../../../Database/redux/store";
import useCarSteps from "../steps/useCarSteps";
import { CarTableType } from "../../../../Database/connector/powersync/AppSchema";
import { editCar } from "../../../../Database/redux/cars/functions/editCar";
import { useDatabase } from "../../../../Database/connector/Database";
import getFile from "../../../../Database/utils/getFile";
import { UseCustomFormProps } from "../../../constants/constants";

const useEditCarForm = (
    car: CarTableType,
    dismissBottomSheet: () => void,
    carImage?: string
) => {
    const database = useDatabase();

    const carFormField = {
        ...car,
        image: getFile(car.image ?? undefined, carImage)
    } as CarFormFieldType;

    const {
        control,
        handleSubmit,
        trigger,
        reset,
        resetField,
        formState,
    } = useForm<CarFormFieldType>(useCarFormProps(carFormField));

    const submitHandler =
        handleSubmit(async (editedCar: CarFormFieldType) => {
            try {
                await store.dispatch(editCar({
                    database,
                    oldCar: car,
                    newCar: editedCar
                }));

                reset();
                dismissBottomSheet();
            } catch (e) {
                console.error("Hiba a submitHandler-ben:", e);
            }
        });

    return {
        control,
        submitHandler,
        reset,
        trigger,
        steps: useCarSteps(control, resetField),
        formState
    } as UseCustomFormProps
}

export default useEditCarForm;