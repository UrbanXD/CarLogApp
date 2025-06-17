import React from "react";
import { CarTableType } from "../../../Database/connector/powersync/AppSchema.ts";
import EditForm from "../../../Form/components/EditForm.tsx";
import { useAppDispatch } from "../../../../hooks/index.ts";
import { useDatabase } from "../../../Database/connector/Database.ts";
import { useBottomSheet } from "../../../BottomSheet/context/BottomSheetContext.ts";
import { useAlert } from "../../../Alert/context/AlertProvider.tsx";
import { useForm } from "react-hook-form";
import { EditCarFormFieldType, useEditCarFormProps} from "../../schemas/carSchema.ts";
import getFile from "../../../Database/utils/getFile.ts";
import useCarSteps from "../../hooks/useCarSteps.tsx";
import { editCar } from "../../../Database/redux/cars/functions/editCar.ts";

interface EditCarFormProps {
    car: CarTableType
    carImage?: string
    stepIndex: number
}
const EditCarForm: React.FC<EditCarFormProps> = ({
    car,
    carImage,
    stepIndex
}) => {
    const dispatch = useAppDispatch();
    const database = useDatabase();
    const { dismissBottomSheet } = useBottomSheet();
    const { addToast } = useAlert();

    const editCarFormFieldType: EditCarFormFieldType = {
        ...car,
        image: getFile(car.image ?? undefined, carImage)
    };
    const {
        control,
        resetField,
        reset,
        handleSubmit
    } = useForm<EditCarFormFieldType>(useEditCarFormProps(editCarFormFieldType));

    const { steps } = useCarSteps(control, resetField);

    const submitHandler =
        handleSubmit(async (editedCar) => {
            try {
                await dispatch(editCar({
                    database,
                    oldCar: car,
                    newCar: editedCar
                })).unwrap();

                const step = steps[stepIndex ?? 0];
                if (steps[stepIndex] && step.editToastMessages) {
                    addToast(step.editToastMessages.success());
                }
                dismissBottomSheet();
            } catch (e) {
                console.error("Hiba a submitHandler-ben:", e);
            }
        });

    return (
        <EditForm
            steps={ steps.map(step => step.render) }
            stepIndex={ stepIndex }
            submitHandler={ submitHandler }
            reset={ reset }
        />
    )
}

export default EditCarForm;