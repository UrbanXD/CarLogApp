import React from "react";
import EditForm from "../../../../components/Form/EditForm.tsx";
import { useAppDispatch } from "../../../../hooks/index.ts";
import { useForm } from "react-hook-form";
import { EditCarFormFieldType, useEditCarFormProps } from "../../schemas/carSchema.ts";
import useCarSteps from "../../hooks/useCarSteps.tsx";
import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import { editCar } from "../../model/actions/editCar.ts";
import { CarDto } from "../../model/types/index.ts";
import { useAlert } from "../../../../ui/alert/hooks/useAlert.ts";
import { useBottomSheet } from "../../../../ui/bottomSheet/contexts/BottomSheetContext.ts";

export interface EditCarFormProps {
    car: CarDto;
    stepIndex: number;
}

const EditCarForm: React.FC<EditCarFormProps> = ({
    car,
    stepIndex
}) => {
    const dispatch = useAppDispatch();
    const database = useDatabase();
    const { openToast } = useAlert();
    const { dismissBottomSheet } = useBottomSheet();

    const editCarFormFieldType: EditCarFormFieldType = {
        ...car,
        image: car.image?.image || null
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
                if(steps[stepIndex] && step.editToastMessages) {
                    openToast(step.editToastMessages.success());
                }

                if(dismissBottomSheet) dismissBottomSheet(true);
            } catch(e) {
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
    );
};

export default EditCarForm;