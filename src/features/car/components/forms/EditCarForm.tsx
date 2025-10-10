import React, { useMemo } from "react";
import { useAppDispatch } from "../../../../hooks/index.ts";
import { useForm } from "react-hook-form";
import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import { editCar } from "../../model/actions/editCar.ts";
import { useAlert } from "../../../../ui/alert/hooks/useAlert.ts";
import { useBottomSheet } from "../../../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import { CarFormFields, useEditCarFormProps } from "../../schemas/form/carForm.ts";
import { Car } from "../../schemas/carSchema.ts";
import { EDIT_CAR_FORM_STEPS } from "../../constants/index.ts";
import { useEditCarSteps } from "../../hooks/useEditCarSteps.tsx";
import Form from "../../../../components/Form/Form.tsx";
import { EditFormButtons } from "../../../../components/Button/presets/EditFormButtons.tsx";

export type EditCarFormProps = {
    car: Car
    stepIndex: EDIT_CAR_FORM_STEPS
}

const EditCarForm: React.FC<EditCarFormProps> = ({
    car,
    stepIndex
}) => {
    const dispatch = useAppDispatch();
    const database = useDatabase();
    const { openToast } = useAlert();
    const { dismissBottomSheet } = useBottomSheet();

    const form = useForm<CarFormFields>(useEditCarFormProps(car));
    const { handleSubmit, reset } = form;

    const editFields = useEditCarSteps({ ...form, index: stepIndex, car });

    const submitHandler = useMemo(() => handleSubmit(
        async (formResult: CarFormFields) => {
            try {
                await dispatch(editCar({ database, formResult }));

                openToast(editFields.toastMessages.success());

                if(dismissBottomSheet) dismissBottomSheet(true);
            } catch(e) {
                console.error("Hiba a submitHandler-ben:", e);
            }
        },
        (errors) => {
            console.log("Edit car validation errors", errors);
        }
    ), [handleSubmit, editFields]);

    return (
        <Form>
            { editFields.render() }
            <EditFormButtons reset={ reset } submit={ submitHandler }/>
        </Form>
    );
};

export default EditCarForm;