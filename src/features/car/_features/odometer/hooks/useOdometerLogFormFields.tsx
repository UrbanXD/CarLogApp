import { UseFormReturn, useWatch } from "react-hook-form";
import React, { useEffect, useMemo } from "react";
import { FormFields } from "../../../../../types";
import { CarPickerInput } from "../../../components/forms/inputFields/CarPickerInput.tsx";
import { NoteInput } from "../../../../../components/Input/_presets/NoteInput.tsx";
import { OdometerLogFormFields } from "../enums/odometerLogFormFields.ts";
import { OdometerValueInput } from "../components/forms/inputFields/OdometerValueInput.tsx";
import { OdometerLog } from "../schemas/odometerLogSchema.ts";
import { OdometerChangeLogFormFields } from "../schemas/form/odometerChangeLogForm.ts";
import { convertOdometerValueFromKilometer } from "../utils/convertOdometerUnit.ts";
import { EditToast } from "../../../../../ui/alert/presets/toast";
import { useTranslation } from "react-i18next";
import { useDatabase } from "../../../../../contexts/database/DatabaseContext.ts";
import { useCar } from "../../../hooks/useCar.ts";
import { useWatchedQueryItem } from "../../../../../database/hooks/useWatchedQueryItem.ts";

type UseOdometerLogFormFieldsProps = {
    form: UseFormReturn<OdometerChangeLogFormFields>
    odometerLog?: OdometerLog
}

export function useOdometerLogFormFields({
    form,
    odometerLog
}: UseOdometerLogFormFieldsProps) {
    const { control, setValue, clearErrors, getFieldState } = form;
    const { t } = useTranslation();
    const { odometerLogDao } = useDatabase();

    const formOdometerLogId = useWatch({ control, name: "id" });
    const formCarId = useWatch({ control, name: "carId" });
    const formDate = useWatch({ control, name: "date" });

    const memoizedLimitQuery = useMemo(() => odometerLogDao.odometerLimitWatchedQueryItem(
        formCarId,
        formDate,
        formOdometerLogId ? [formOdometerLogId] : []
    ), [odometerLogDao, formCarId, formDate, formOdometerLogId]);

    const { car } = useCar({ carId: formCarId, options: { queryOnce: true } });
    const { data: odometerLimit } = useWatchedQueryItem(memoizedLimitQuery);

    useEffect(() => {
        if(car && car.id === formCarId) {
            setValue("conversionFactor", car?.odometer.unit.conversionFactor ?? 1);
            if(car && odometerLog && !getFieldState("value").isDirty) {
                setValue("value", convertOdometerValueFromKilometer(
                    odometerLog.valueInKm,
                    car.odometer.unit.conversionFactor
                ));
            }
            clearErrors();
        }
    }, [car, formCarId, odometerLog]);

    const fields: Record<OdometerLogFormFields, FormFields> = useMemo(() => ({
        [OdometerLogFormFields.Car]: {
            render: () => <CarPickerInput control={ control } fieldName="carId"/>,
            editToastMessages: EditToast
        },
        [OdometerLogFormFields.DateAndOdometerValue]: {
            render: () => <OdometerValueInput
                control={ control }
                odometerValueFieldName="value"
                dateFieldName="date"
                currentOdometerValueTranslationKey={
                    odometerLog
                    ? "odometer.original_value"
                    : "odometer.current_value"
                }
                currentOdometerValue={ odometerLog?.value ?? car?.odometer.value }
                odometerLimit={ odometerLimit }
                unitText={ car?.odometer.unit.short }
            />,
            editToastMessages: EditToast
        },
        [OdometerLogFormFields.Note]: {
            render: () => <NoteInput
                control={ control }
                setValue={ setValue }
                fieldName="note"
            />,
            editToastMessages: EditToast
        }
    }), [control, setValue, car, t, odometerLog, odometerLimit]);

    const fullForm: FormFields = {
        render: () => ([
            <React.Fragment key="car">
                { fields[OdometerLogFormFields.Car].render() }
            </React.Fragment>,
            <React.Fragment key="value">
                { fields[OdometerLogFormFields.DateAndOdometerValue].render() }
            </React.Fragment>,
            <React.Fragment key="note">
                { fields[OdometerLogFormFields.Note].render() }
            </React.Fragment>
        ]),
        editToastMessages: EditToast
    };

    return { fields, fullForm };
}