import React from "react";
import EditForm from "../../../../components/Form/EditForm.tsx";
import { useAppDispatch } from "../../../../hooks/index.ts";
import { useForm } from "react-hook-form";
import useCarSteps from "../../hooks/useCarSteps.tsx";
import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import { editCar } from "../../model/actions/editCar.ts";
import { useAlert } from "../../../../ui/alert/hooks/useAlert.ts";
import { useBottomSheet } from "../../../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import { CarFormFields, useEditCarFormProps } from "../../schemas/form/carForm.ts";
import { Car } from "../../schemas/carSchema.ts";

export type EditCarFormProps = {
    car: Car
    stepIndex: number
}

const EditCarForm: React.FC<EditCarFormProps> = ({
    car,
    stepIndex
}) => {
    const dispatch = useAppDispatch();
    const database = useDatabase();
    const { openToast } = useAlert();
    const { dismissBottomSheet } = useBottomSheet();

    const {
        control,
        resetField,
        reset,
        setValue,
        getValues,
        handleSubmit
    } = useForm<CarFormFields>(useEditCarFormProps(car));

    const { steps } = useCarSteps<CarFormFields>({ control, resetField, setValue, getValues });

    const submitHandler = handleSubmit(
        async (formResult: CarFormFields) => {
            try {
                await dispatch(editCar({ database, formResult }));

                const step = steps[stepIndex ?? 0];
                if(steps[stepIndex] && step.editToastMessages) {
                    openToast(step.editToastMessages.success());
                }

                if(dismissBottomSheet) dismissBottomSheet(true);
            } catch(e) {
                console.error("Hiba a submitHandler-ben:", e);
            }
        },
        (errors) => {
            console.log("Edit car validation errors", errors);
        }
    );

    return (
        <EditForm
            renderInputFields={ () => steps[stepIndex].render() }
            submitHandler={ submitHandler }
            reset={ reset }
        />
    );
};

export default EditCarForm;