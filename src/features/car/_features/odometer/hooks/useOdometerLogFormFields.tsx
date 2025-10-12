import { UseFormReturn, useWatch } from "react-hook-form";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Car } from "../../../schemas/carSchema.ts";
import useCars from "../../../hooks/useCars.ts";
import { FormFields } from "../../../../../types/index.ts";
import { CarPickerInput } from "../../../components/forms/inputFields/CarPickerInput.tsx";
import { CarEditNameToast } from "../../../presets/toast/index.ts";
import Input from "../../../../../components/Input/Input.ts";
import InputDatePicker from "../../../../../components/Input/datePicker/InputDatePicker.tsx";
import { NoteInput } from "../../../../../components/Input/_presets/NoteInput.tsx";
import { OdometerLogFormFields } from "../enums/odometerLogFormFields.ts";
import { OdometerValueInput } from "../components/forms/inputFields/OdometerValueInput.tsx";
import { OdometerLog } from "../schemas/odometerLogSchema.ts";
import { OdometerLogFields } from "../schemas/form/odometerLogForm.ts";
import { convertOdometerValueFromKilometer } from "../utils/convertOdometerUnit.ts";

type UseOdometerLogFormFieldsProps = UseFormReturn<OdometerLogFields> & {
    odometerLog?: OdometerLog
    defaultCarId?: string
}

export function useOdometerLogFormFields({
    odometerLog,
    defaultCarId,
    ...restProps
}: UseOdometerLogFormFieldsProps) {
    const { control, setValue, clearErrors, getFieldState } = restProps;
    const { selectedCar, getCar } = useCars();

    const [car, setCar] = useState<Car | null>(
        odometerLog
        ? getCar(odometerLog.carId) ?? selectedCar
        : defaultCarId
          ? getCar(defaultCarId) ?? selectedCar
          : selectedCar
    );

    const formCarId = useWatch({ control, name: "carId" });

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

    const getOdometerLogSubtitle = useCallback(() => {
        if(!odometerLog) return undefined;

        let subtitle = `A bejegyzés eredeti kilométeróra-állása ${ odometerLog.value } ${ odometerLog.unit.short }`;
        if(car && odometerLog.unit.id !== car.odometer.unit.id) {
            const odometerValueConvertToCarOdometerUnit = convertOdometerValueFromKilometer(
                odometerLog.valueInKm,
                car.odometer.unit.conversionFactor
            );
            subtitle += ` (${ odometerValueConvertToCarOdometerUnit } ${ car.odometer.unit.short })`;
        }

        return subtitle;
    }, [odometerLog, car]);

    const fields: Record<OdometerLogFormFields, FormFields> = useMemo(() => ({
        [OdometerLogFormFields.Car]: {
            render: () => <CarPickerInput control={ control } fieldName="carId"/>,
            editToastMessages: CarEditNameToast
        },
        [OdometerLogFormFields.OdometerValue]: {
            render: () => <OdometerValueInput
                control={ control }
                fieldName="value"
                subtitle={ getOdometerLogSubtitle() }
                currentOdometerValue={ car?.odometer.value }
                unitText={ car?.odometer.unit.short }
            />,
            editToastMessages: CarEditNameToast
        },
        [OdometerLogFormFields.Date]: {
            render: () => (
                <Input.Field
                    control={ control }
                    fieldName="date"
                    fieldNameText="Dátum"
                >
                    <InputDatePicker/>
                </Input.Field>
            ),
            editToastMessages: CarEditNameToast
        },
        [OdometerLogFormFields.Note]: {
            render: () => <NoteInput
                control={ control }
                setValue={ setValue }
                fieldName="note"
            />,
            editToastMessages: CarEditNameToast
        }
    }), [control, setValue, car, getOdometerLogSubtitle]);

    const fullForm: FormFields = {
        render: () => ([
            <React.Fragment key="car">{ fields[OdometerLogFormFields.Car].render() }</React.Fragment>,
            <React.Fragment key="value">{ fields[OdometerLogFormFields.OdometerValue].render() }</React.Fragment>,
            <React.Fragment key="date">{ fields[OdometerLogFormFields.Date].render() }</React.Fragment>,
            <React.Fragment key="note">{ fields[OdometerLogFormFields.Note].render() }</React.Fragment>
        ]),
        editToastMessages: CarEditNameToast
    };

    return { fields, fullForm };
}