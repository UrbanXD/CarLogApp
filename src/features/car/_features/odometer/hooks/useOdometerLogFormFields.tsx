import { UseFormReturn, useWatch } from "react-hook-form";
import React, { useEffect, useMemo, useState } from "react";
import { Car } from "../../../schemas/carSchema.ts";
import useCars from "../../../hooks/useCars.ts";
import { FormFields } from "../../../../../types/index.ts";
import { CarPickerInput } from "../../../components/forms/inputFields/CarPickerInput.tsx";
import { NoteInput } from "../../../../../components/Input/_presets/NoteInput.tsx";
import { OdometerLogFormFields } from "../enums/odometerLogFormFields.ts";
import { OdometerValueInput } from "../components/forms/inputFields/OdometerValueInput.tsx";
import { OdometerLog } from "../schemas/odometerLogSchema.ts";
import { OdometerChangeLogFormFields } from "../schemas/form/odometerChangeLogForm.ts";
import { convertOdometerValueFromKilometer } from "../utils/convertOdometerUnit.ts";
import { EditToast } from "../../../../../ui/alert/presets/toast/index.ts";
import { useTranslation } from "react-i18next";
import { OdometerLimit } from "../model/dao/OdometerLogDao.ts";
import { useDatabase } from "../../../../../contexts/database/DatabaseContext.ts";
import { formatWithUnit } from "../../../../../utils/formatWithUnit.ts";
import dayjs from "dayjs";

type UseOdometerLogFormFieldsProps = UseFormReturn<OdometerChangeLogFormFields> & {
    odometerLog?: OdometerLog
    defaultCarId?: string
}

export function useOdometerLogFormFields({
    odometerLog,
    defaultCarId,
    ...restProps
}: UseOdometerLogFormFieldsProps) {
    const { control, setValue, clearErrors, getFieldState } = restProps;
    const { t } = useTranslation();
    const { odometerLogDao } = useDatabase();
    const { selectedCar, getCar } = useCars();

    const [car, setCar] = useState<Car | null>(
        odometerLog
        ? getCar(odometerLog.carId) ?? selectedCar
        : defaultCarId
          ? getCar(defaultCarId) ?? selectedCar
          : selectedCar
    );
    const [odometerLimit, setOdometerLimit] = useState<OdometerLimit | null>(null);

    const formCarId = useWatch({ control, name: "carId" });
    const formDate = useWatch({ control, name: "date" });

    useEffect(() => {
        const car = getCar(formCarId);
        setCar(car ?? null);
        setValue("conversionFactor", car?.odometer.unit.conversionFactor ?? 1);
        if(car && odometerLog && !getFieldState("value").isDirty) {
            setValue("value", convertOdometerValueFromKilometer(
                odometerLog.valueInKm,
                car.odometer.unit.conversionFactor
            ));
        }
        clearErrors();
    }, [formCarId, odometerLog]);

    useEffect(() => {
        (async () => {
            if(!formCarId || !formDate) return;

            setOdometerLimit(await odometerLogDao.getOdometerLimitByDate(formCarId, formDate));
        })();

        setOdometerLimit();
    }, [formCarId, formDate]);

    const fields: Record<OdometerLogFormFields, FormFields> = useMemo(() => ({
        [OdometerLogFormFields.Car]: {
            render: () => <CarPickerInput control={ control } fieldName="carId"/>,
            editToastMessages: EditToast
        },
        [OdometerLogFormFields.DateAndOdometerValue]: {
            render: () => <OdometerValueInput
                control={ control }
                odometerValueFieldName="value"
                odometerValueSubtitle={ odometerLog ? t(
                    "odometer.original_value",
                    { value: formatWithUnit(odometerLog.value, odometerLog.unit.short) }
                ) : odometerLimit && t(
                    "odometer.limit",
                    {
                        value: formatWithUnit(odometerLimit.min.value, odometerLimit.unitText),
                        date: dayjs(odometerLimit.min.date).format("L")
                    }
                ) }
                dateFieldName="date"
                currentOdometerValue={ car?.odometer.value }
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