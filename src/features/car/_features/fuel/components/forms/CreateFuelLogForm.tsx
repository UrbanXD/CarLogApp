import MultiStepForm from "../../../../../../components/Form/MultiStepForm.tsx";
import React from "react";
import { useAlert } from "../../../../../../ui/alert/hooks/useAlert.ts";
import { useBottomSheet } from "../../../../../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import { useDatabase } from "../../../../../../contexts/database/DatabaseContext.ts";
import useCars from "../../../../hooks/useCars.ts";
import { useForm } from "react-hook-form";
import { CarCreateToast } from "../../../../presets/toast/index.ts";
import { useFuelLogFormFields } from "../../hooks/useFuelLogForm.tsx";
import { FuelLogFields, useCreateFuelLogFormProps } from "../../schemas/form/fuelLogForm.ts";
import { updateCarOdometer } from "../../../../model/slice/index.ts";
import { useAppDispatch } from "../../../../../../hooks/index.ts";

export function CreateFuelLogForm() {
    const dispatch = useAppDispatch();
    const { openToast } = useAlert();
    const { dismissBottomSheet } = useBottomSheet();
    const { fuelLogDao } = useDatabase();
    const { selectedCar } = useCars();

    const form = useForm<FuelLogFields>(useCreateFuelLogFormProps(selectedCar));
    const { handleSubmit } = form;

    const { multiStepFormSteps } = useFuelLogFormFields(form);

    const submitHandler = handleSubmit(
        async (formResult: FuelLogFields) => {
            try {
                const result = await fuelLogDao.create(formResult);
                if(result?.odometer) dispatch(updateCarOdometer({ odometer: result.odometer }));

                openToast(CarCreateToast.success());

                if(dismissBottomSheet) dismissBottomSheet(true);
            } catch(e) {
                openToast(CarCreateToast.error());
                console.error("Hiba a submitHandler-ben log:", e);
            }
        },
        (errors) => {
            console.log("Create expense validation errors", errors);
            openToast(CarCreateToast.error());
        }
    );

    return (
        <MultiStepForm
            steps={ multiStepFormSteps }
            submitHandler={ submitHandler }
            { ...form }
        />
    );
}