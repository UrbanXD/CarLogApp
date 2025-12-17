import { useDatabase } from "../../../../../../contexts/database/DatabaseContext.ts";
import { useAlert } from "../../../../../../ui/alert/hooks/useAlert.ts";
import { useBottomSheet } from "../../../../../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import { FormState, useForm } from "react-hook-form";
import { FormFields, SubmitHandlerArgs } from "../../../../../../types/index.ts";
import React from "react";
import Form from "../../../../../../components/Form/Form.tsx";
import { FuelLog } from "../../schemas/fuelLogSchema.ts";
import { FuelLogFormFieldsEnum } from "../../enums/fuelLogFormFields.tsx";
import { FuelLogFields, useEditFuelLogFormProps } from "../../schemas/form/fuelLogForm.ts";
import { useFuelLogFormFields } from "../../hooks/useFuelLogForm.tsx";
import { updateCarOdometer } from "../../../../model/slice/index.ts";
import { Odometer } from "../../../odometer/schemas/odometerSchema.ts";
import { useAppDispatch } from "../../../../../../hooks/index.ts";
import { InvalidFormToast } from "../../../../../../ui/alert/presets/toast/index.ts";

type EditFuelLogFormProps = {
    fuelLog: FuelLog
    /** Which field will be edited, if its undefined that means full form view will appear */
    field: FuelLogFormFieldsEnum
    onFormStateChange?: (formState: FormState<FuelLogFields>) => void
}

export function EditFuelLogForm({
    fuelLog,
    field,
    onFormStateChange
}: EditFuelLogFormProps) {
    const dispatch = useAppDispatch();
    const { fuelLogDao, odometerLogDao } = useDatabase();
    const { openToast } = useAlert();
    const { dismissBottomSheet } = useBottomSheet();

    const form = useForm<FuelLogFields>(useEditFuelLogFormProps(fuelLog));
    const { fields } = useFuelLogFormFields({ ...form, odometer: fuelLog.odometer });
    const editFields: FormFields = fields[field];

    const submitHandler: SubmitHandlerArgs<FuelLogFields> = {
        onValid: async (formResult) => {
            try {
                const result = await fuelLogDao.update(formResult);

                let newCarOdometer: Odometer | null = null;
                let oldCarOdometer: Odometer | null = null;

                if(result?.odometer) newCarOdometer = await odometerLogDao.getOdometerByCarId(result.odometer.carId);
                if(fuelLog?.odometer && result?.odometer?.carId !== fuelLog.odometer.carId) {
                    oldCarOdometer = await odometerLogDao.getOdometerByCarId(fuelLog.odometer.carId);
                }

                if(newCarOdometer) dispatch(updateCarOdometer({ odometer: newCarOdometer }));
                if(oldCarOdometer) dispatch(updateCarOdometer({ odometer: oldCarOdometer }));

                openToast(editFields.editToastMessages.success());

                if(dismissBottomSheet) dismissBottomSheet(true);
            } catch(e) {
                openToast(editFields.editToastMessages.error());
                console.error("Hiba a submitHandler-ben:", e);
            }
        },
        onInvalid: (errors) => {
            openToast(InvalidFormToast.warning());
            console.log("Edit fuel log validation errors", errors);
        }
    };

    return (
        <Form
            edit
            form={ form }
            formFields={ editFields.render() }
            submitHandler={ submitHandler }
            onFormStateChange={ onFormStateChange }
        />
    );
}