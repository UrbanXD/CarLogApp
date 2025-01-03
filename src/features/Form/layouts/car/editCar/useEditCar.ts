import {ReactElement} from "react";
import {CarFormFieldType, useCarFormProps} from "../../../constants/schemas/carSchema";
import {useForm} from "react-hook-form";
import {store} from "../../../../Database/redux/store";
import useCarSteps from "../steps/useCarSteps";
import {CarTableType} from "../../../../Database/connector/powersync/AppSchema";
import {undefined} from "zod";
import {decode, encode} from "base64-arraybuffer";
import {editCar} from "../../../../Database/redux/cars/functions/editCar";
import {useDatabase} from "../../../../Database/connector/Database";

const useEditCarForm = (
    car: CarTableType,
    forceCloseBottomSheet: () => void
) => {
    const database = useDatabase();

    const {
        control,
        handleSubmit,
        trigger,
        reset,
        resetField,
        formState,
    } =
        useForm<CarFormFieldType>(useCarFormProps(car as CarFormFieldType));

    const submitHandler =
        handleSubmit(async (editedCar: CarFormFieldType) => {
            try {
                const carTableRow = {
                    ...car,
                    ...editedCar,
                } as CarTableType;
                await store.dispatch(editCar({ database, car: carTableRow }))
                reset();
                forceCloseBottomSheet();
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
    }
}

export default useEditCarForm;