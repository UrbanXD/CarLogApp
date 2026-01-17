import { useAppDispatch, useAppSelector } from "../../../../hooks/index.ts";
import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import { useAlert } from "../../../../ui/alert/hooks/useAlert.ts";
import { useBottomSheet } from "../../../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import { FormState, useForm } from "react-hook-form";
import { FormFields, SubmitHandlerArgs } from "../../../../types/index.ts";
import React from "react";
import { Odometer } from "../../../car/_features/odometer/schemas/odometerSchema.ts";
import { updateCarOdometer } from "../../../car/model/slice/index.ts";
import Form from "../../../../components/Form/Form.tsx";
import { RideLog } from "../../schemas/rideLogSchema.ts";
import { RideLogFormFieldsEnum } from "../../enums/RideLogFormFields.ts";
import { RideLogFormFields, useEditRideLogFormProps } from "../../schemas/form/rideLogForm.ts";
import { getUser } from "../../../user/model/selectors/index.ts";
import { useRideLogFormFields } from "../../hooks/useRideLogFormFields.tsx";
import { InvalidFormToast } from "../../../../ui/alert/presets/toast/index.ts";

type EditRideLogFormProps = {
    rideLog: RideLog
    /** Which field will be edited */
    field: RideLogFormFieldsEnum
    onFormStateChange?: (formState: FormState<RideLogFormFields>) => void
}

export function EditRideLogForm({
    rideLog,
    field,
    onFormStateChange
}: EditRideLogFormProps) {
    const dispatch = useAppDispatch();
    const user = useAppSelector(getUser);
    const { rideLogDao, odometerLogDao } = useDatabase();
    const { openToast } = useAlert();
    const { dismissBottomSheet } = useBottomSheet();

    const form = useForm<RideLogFormFields>(useEditRideLogFormProps(rideLog));
    const { fields } = useRideLogFormFields({
        form,
        setCarOdometerValueWhenInputNotTouched: false,
        setEndTimeWhenInputNotTouched: false,
        startOdometer: rideLog.startOdometer,
        endOdometer: rideLog.endOdometer
    });
    const editFields: FormFields = fields[field];

    const submitHandler: SubmitHandlerArgs<RideLogFormFields> = {
        onValid: async (formResult) => {
            try {
                const result = await rideLogDao.update(formResult);

                let newCarOdometer: Odometer | null = null;
                let oldCarOdometer: Odometer | null = null;

                if(result) {
                    newCarOdometer = await odometerLogDao.getOdometerByCarId(result.carId);

                    if(result.carId !== rideLog.carId) oldCarOdometer = await odometerLogDao.getOdometerByCarId(rideLog.carId);
                }

                if(newCarOdometer) dispatch(updateCarOdometer({ odometer: newCarOdometer }));
                if(oldCarOdometer) dispatch(updateCarOdometer({ odometer: oldCarOdometer }));

                openToast(editFields.editToastMessages.success());

                if(dismissBottomSheet) dismissBottomSheet(true);
            } catch(e) {
                openToast(editFields.editToastMessages.error());
                console.error("Hiba a submitHandler-ben (ride log):", e);
            }
        },
        onInvalid: (errors) => {
            openToast(InvalidFormToast.warning());
            console.log("Edit ride log validation errors", errors);
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