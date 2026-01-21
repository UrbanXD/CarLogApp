import { UseFormReturn, useWatch } from "react-hook-form";
import React, { useEffect, useMemo } from "react";
import { FormFields, Steps } from "../../../../../types";
import { CarPickerInput } from "../../../components/forms/inputFields/CarPickerInput.tsx";
import { AmountInput } from "../../../../_shared/currency/components/AmountInput.tsx";
import Input from "../../../../../components/Input/Input.ts";
import { NoteInput } from "../../../../../components/Input/_presets/NoteInput.tsx";
import { FuelLogFormFieldsEnum } from "../enums/fuelLogFormFields.tsx";
import { FuelLogFormFields } from "../schemas/form/fuelLogForm.ts";
import { OdometerValueInput } from "../../odometer/components/forms/inputFields/OdometerValueInput.tsx";
import { FuelInput } from "../components/forms/inputFields/FuelInput.tsx";
import { EditToast } from "../../../../../ui/alert/presets/toast";
import { useTranslation } from "react-i18next";
import { Odometer } from "../../odometer/schemas/odometerSchema.ts";
import { useDatabase } from "../../../../../contexts/database/DatabaseContext.ts";
import { useCar } from "../../../hooks/useCar.ts";
import { useWatchedQueryItem } from "../../../../../database/hooks/useWatchedQueryItem.ts";

type UseFuelLogFormFieldsProps = {
    form: UseFormReturn<FuelLogFormFields, any, FuelLogFormFields>
    odometer?: Odometer | null
}

export function useFuelLogFormFields({ form, odometer }: UseFuelLogFormFieldsProps) {
    const { t } = useTranslation();
    const { control, setValue, clearErrors } = form;
    const { odometerLogDao } = useDatabase();

    const formLogId = useWatch({ control, name: "odometerLogId" });
    const formCarId = useWatch({ control, name: "carId" });
    const formDate = useWatch({ control, name: "date" });

    const memoizedQuery = useMemo(() => odometerLogDao.odometerLimitWatchedQueryItem(
        formCarId,
        formDate,
        formLogId ? [formLogId] : []
    ), [odometerLogDao, formCarId, formDate, formLogId]);

    const { data: odometerLimit } = useWatchedQueryItem(memoizedQuery);

    const { car } = useCar({ carId: formCarId, options: { queryOnce: true } });

    useEffect(() => {
        if(car && car.id === formCarId) {
            setValue("fuelUnitId", car.fuelTank.unit.id);
            clearErrors();
        }
    }, [car, formCarId, setValue]);

    const fields: Record<FuelLogFormFieldsEnum, FormFields> = useMemo(() => ({
        [FuelLogFormFieldsEnum.Car]: {
            render: () => <CarPickerInput<FuelLogFormFields>
                control={ control }
                fieldName="carId"
            />,
            editToastMessages: EditToast
        },
        [FuelLogFormFieldsEnum.Quantity]: {
            render: () => <FuelInput<FuelLogFormFields>
                control={ control }
                setValue={ setValue }
                fieldName="quantity"
                capacity={ car?.fuelTank.capacity ?? 0 }
                fuelTypeText={ t(`fuel.types.${ car?.fuelTank.type.key }`) }
                unitText={ car?.fuelTank.unit.short }
            />,
            editToastMessages: EditToast
        },
        [FuelLogFormFieldsEnum.Amount]: {
            render: () => <AmountInput
                control={ control }
                setValue={ setValue }
                fieldName="expense"
                outsideQuantityFieldName="quantity"
                showsQuantityInput={ false }
                defaultCurrency={ car?.currency.id }
            />,
            editToastMessages: EditToast
        },
        [FuelLogFormFieldsEnum.DateAndOdometerValue]: {
            render: () => <>
                <OdometerValueInput
                    control={ control }
                    odometerValueFieldName="odometerValue"
                    dateFieldName="date"
                    currentOdometerValueTranslationKey={
                        odometer
                        ? "odometer.original_value"
                        : "odometer.current_value"
                    }
                    currentOdometerValue={ odometer?.value ?? car?.odometer.value }
                    odometerLimit={ odometerLimit }
                    unitText={ car?.odometer.unit.short }
                    odometerValueOptional
                />
            </>,
            editToastMessages: EditToast
        },
        [FuelLogFormFieldsEnum.Note]: {
            render: () => <NoteInput
                control={ control }
                setValue={ setValue }
                fieldName="note"
            />,
            editToastMessages: EditToast
        }
    }), [control, setValue, car, t, odometer, odometerLimit]);

    const multiStepFormSteps: Steps = [
        {
            title: t("fuel.steps.basic_information"),
            fields: ["carId", "date", "odometerValue", "note"],
            render: () => (
                <Input.Group>
                    { fields[FuelLogFormFieldsEnum.Car].render() }
                    { fields[FuelLogFormFieldsEnum.DateAndOdometerValue].render() }
                    { fields[FuelLogFormFieldsEnum.Note].render() }
                </Input.Group>
            )
        },
        {
            title: t("fuel.steps.fueling_information"),
            fields: ["quantity", "amount", "exchangeRate", "currencyId"],
            render: () => (
                <Input.Group>
                    { fields[FuelLogFormFieldsEnum.Quantity].render() }
                    { fields[FuelLogFormFieldsEnum.Amount].render() }
                </Input.Group>
            )
        }
    ];

    return { fields, multiStepFormSteps };
}