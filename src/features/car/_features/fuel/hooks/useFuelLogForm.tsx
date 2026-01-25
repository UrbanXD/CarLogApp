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

type UseFuelLogFormFieldsProps = {
    form: UseFormReturn<FuelLogFormFields, any, FuelLogFormFields>
    isEdit?: boolean
}

export function useFuelLogFormFields({ form, isEdit }: UseFuelLogFormFieldsProps) {
    const { t } = useTranslation();
    const { control, setValue, getFieldState, clearErrors } = form;

    const formCarId = useWatch({ control, name: "carId" });

    useEffect(() => {
        clearErrors();
    }, [formCarId]);

    const fields: Record<FuelLogFormFieldsEnum, FormFields> = useMemo(() => ({
        [FuelLogFormFieldsEnum.Car]: {
            render: () => <CarPickerInput<FuelLogFormFields>
                control={ control }
                fieldName="carId"
            />,
            editToastMessages: EditToast
        },
        [FuelLogFormFieldsEnum.Quantity]: {
            render: () => <FuelInput
                control={ control }
                setValue={ setValue }
                fieldName="quantity"
                fuelUnitIdFieldName="fuelUnitId"
                carIdFieldName="carId"
            />,
            editToastMessages: EditToast
        },
        [FuelLogFormFieldsEnum.Amount]: {
            render: () => <AmountInput
                control={ control }
                setValue={ setValue }
                fieldName="expense"
                carIdFieldName="carId"
                outsideQuantityFieldName="quantity"
                showsQuantityInput={ false }
            />,
            editToastMessages: EditToast
        },
        [FuelLogFormFieldsEnum.DateAndOdometerValue]: {
            render: () => <>
                <OdometerValueInput
                    control={ control }
                    setValue={ setValue }
                    getFieldState={ getFieldState }
                    idFieldName="odometerLogId"
                    carIdFieldName="carId"
                    odometerValueFieldName="odometerValue"
                    dateFieldName="date"
                    odometerValueOptional
                    changeCarOdometerValueWhenInputNotTouched={ !isEdit }
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
    }), [control, setValue, getFieldState, t, isEdit]);

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