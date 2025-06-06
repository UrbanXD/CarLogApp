import { EditCarFormFieldType, useEditCarFormProps } from "../../../constants/schemas/carSchema";
import { useForm } from "react-hook-form";
import useCarSteps from "../steps/useCarSteps";
import { CarTableType } from "../../../../Database/connector/powersync/AppSchema";
import { editCar } from "../../../../Database/redux/cars/functions/editCar";
import { useDatabase } from "../../../../Database/connector/Database";
import getFile from "../../../../Database/utils/getFile";
import { UseCustomFormProps } from "../../../constants/constants";
import { useAppDispatch } from "../../../../../hooks/index.ts";

const useEditCarForm = (
    car: CarTableType,
    dismissBottomSheet: () => void,
    carImage?: string
) => {
    const dispatch = useAppDispatch();
    const database = useDatabase();

    const {
        control,
        handleSubmit,
        trigger,
        reset,
        resetField,
        formState,
    } = useForm<EditCarFormFieldType>(
            useEditCarFormProps({
                ...car,
                image: getFile(car.image ?? undefined, carImage)
            })
        );

    const submitHandler =
        handleSubmit(async (editedCar: EditCarFormFieldType) => {
            try {
                console.log(editedCar, "grs")
                dispatch(editCar({
                    database,
                    oldCar: car,
                    newCar: editedCar
                }))

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
        steps: useCarSteps(control, resetField).map(step => step.render),
        formState
    } as UseCustomFormProps
}

export default useEditCarForm;