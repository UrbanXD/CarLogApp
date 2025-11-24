import { UseFormReturn, useWatch } from "react-hook-form";
import useCars from "../../../hooks/useCars.ts";
import React, { useEffect, useMemo, useState } from "react";
import { Car } from "../../../schemas/carSchema.ts";
import { FormFields, Steps } from "../../../../../types/index.ts";
import { CarPickerInput } from "../../../components/forms/inputFields/CarPickerInput.tsx";
import { AmountInput } from "../../../../_shared/currency/components/AmountInput.tsx";
import Input from "../../../../../components/Input/Input.ts";
import InputDatePicker from "../../../../../components/Input/datePicker/InputDatePicker.tsx";
import { NoteInput } from "../../../../../components/Input/_presets/NoteInput.tsx";
import { FuelLogFormFieldsEnum } from "../enums/fuelLogFormFields.tsx";
import { FuelLogFields } from "../schemas/form/fuelLogForm.ts";
import { OdometerValueInput } from "../../odometer/components/forms/inputFields/OdometerValueInput.tsx";
import { FuelInput } from "../components/forms/inputFields/FuelInput.tsx";
import { EditToast } from "../../../../../ui/alert/presets/toast/index.ts";
import { useTranslation } from "react-i18next";

type UseFuelLogFormFieldsProps = UseFormReturn<FuelLogFields>

export function useFuelLogFormFields(props: UseFuelLogFormFieldsProps) {
    const { t } = useTranslation();
    const { control, setValue, clearErrors } = props;
    const { getCar } = useCars();

    const [car, setCar] = useState<Car | null>(null);

    const formCarId = useWatch({ control, name: "carId" });

    useEffect(() => {
        const car = getCar(formCarId);
        setCar(car ?? null);
        setValue("ownerId", car?.ownerId);
        setValue("fuelUnitId", car?.fuelTank.unit.id);
        clearErrors();
    }, [formCarId]);

    const fields: Record<FuelLogFormFieldsEnum, FormFields> = useMemo(() => ({
        [FuelLogFormFieldsEnum.Car]: {
            render: () => <CarPickerInput control={ control } fieldName="carId"/>,
            editToastMessages: EditToast
        },
        [FuelLogFormFieldsEnum.Quantity]: {
            render: () => <FuelInput
                control={ control }
                setValue={ setValue }
                fieldName="quantity"
                capacity={ car?.fuelTank.capacity }
                fuelTypeText={ t(`fuel.types.${ car?.fuelTank.type.key }`) }
                unitText={ car?.fuelTank.unit.short }
            />,
            editToastMessages: EditToast
        },
        [FuelLogFormFieldsEnum.Amount]: {
            render: () => <AmountInput
                control={ control }
                setValue={ setValue }
                amountFieldName="amount"
                quantityFieldName="quantity"
                currencyFieldName="currencyId"
                isPricePerUnitFieldName="isPricePerUnit"
                exchangeRateFieldName="exchangeRate"
                showsQuantityInput={ false }
                defaultCurrency={ car?.currency.id }
            />,
            editToastMessages: EditToast
        },
        [FuelLogFormFieldsEnum.Date]: {
            render: () => (
                <Input.Field
                    control={ control }
                    fieldName="date"
                    fieldNameText={ t("date.text") }
                >
                    <InputDatePicker/>
                </Input.Field>
            ),
            editToastMessages: EditToast
        },
        [FuelLogFormFieldsEnum.OdometerValue]: {
            render: () => <OdometerValueInput
                control={ control }
                fieldName="odometerValue"
                currentOdometerValue={ car?.odometer.value }
                unitText={ car?.odometer.unit.short }
                optional
            />,
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
    }), [control, setValue, car, t]);

    const multiStepFormSteps: Steps = [
        {
            title: t("fuel.steps.basic_information"),
            fields: ["carId", "date", "odometerValue", "note"],
            render: () => (
                <Input.Group>
                    { fields[FuelLogFormFieldsEnum.Car].render() }
                    { fields[FuelLogFormFieldsEnum.Date].render() }
                    { fields[FuelLogFormFieldsEnum.OdometerValue].render() }
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