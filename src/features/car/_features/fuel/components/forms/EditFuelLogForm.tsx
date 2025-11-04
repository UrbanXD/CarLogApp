import { useDatabase } from "../../../../../../contexts/database/DatabaseContext.ts";
import { useAlert } from "../../../../../../ui/alert/hooks/useAlert.ts";
import { useBottomSheet } from "../../../../../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import { useForm } from "react-hook-form";
import { ExpenseFields } from "../../../../../expense/schemas/form/expenseForm.ts";
import { FormFields } from "../../../../../../types/index.ts";
import React, { useMemo } from "react";
import Form from "../../../../../../components/Form/Form.tsx";
import { FormButtons } from "../../../../../../components/Button/presets/FormButtons.tsx";
import { FuelLog } from "../../schemas/fuelLogSchema.ts";
import { FuelLogFormFieldsEnum } from "../../enums/fuelLogFormFields.tsx";
import { FuelLogFields, useEditFuelLogFormProps } from "../../schemas/form/fuelLogForm.ts";
import { useFuelLogFormFields } from "../../hooks/useFuelLogForm.tsx";
import { updateCarOdometer } from "../../../../model/slice/index.ts";
import { Odometer } from "../../../odometer/schemas/odometerSchema.ts";
import { useAppDispatch } from "../../../../../../hooks/index.ts";

type EditFuelLogFormProps = {
    fuelLog: FuelLog
    /** Which field will be edited, if its undefined that means full form view will appear */
    field: FuelLogFormFieldsEnum
}

export function EditFuelLogForm({
    fuelLog,
    field
}: EditFuelLogFormProps) {
    const dispatch = useAppDispatch();
    const { fuelLogDao, odometerLogDao } = useDatabase();
    const { openToast } = useAlert();
    const { dismissBottomSheet } = useBottomSheet();

    const form = useForm<FuelLogFields>(useEditFuelLogFormProps(fuelLog));
    const { handleSubmit, reset } = form;

    const { fields } = useFuelLogFormFields(form);
    const editFields: FormFields = fields[field];

    const submitHandler = useMemo(() => handleSubmit(
        async (formResult: ExpenseFields) => {
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
        (errors) => {
            openToast(editFields.editToastMessages.error());
            console.log("Edit fuel log validation errors", errors);
        }
    ), [handleSubmit, editFields]);

    return (
        <Form>
            { editFields.render() }
            <FormButtons reset={ reset } submit={ submitHandler }/>
        </Form>
    );
}