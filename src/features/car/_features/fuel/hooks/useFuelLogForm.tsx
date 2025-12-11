import { UseFormReturn, useWatch } from "react-hook-form";
import useCars from "../../../hooks/useCars.ts";
import React, { useEffect, useMemo, useState } from "react";
import { Car } from "../../../schemas/carSchema.ts";
import { FormFields, Steps } from "../../../../../types/index.ts";
import { CarPickerInput } from "../../../components/forms/inputFields/CarPickerInput.tsx";
import { AmountInput } from "../../../../_shared/currency/components/AmountInput.tsx";
import Input from "../../../../../components/Input/Input.ts";
import { NoteInput } from "../../../../../components/Input/_presets/NoteInput.tsx";
import { FuelLogFormFieldsEnum } from "../enums/fuelLogFormFields.tsx";
import { FuelLogFields } from "../schemas/form/fuelLogForm.ts";
import { OdometerValueInput } from "../../odometer/components/forms/inputFields/OdometerValueInput.tsx";
import { FuelInput } from "../components/forms/inputFields/FuelInput.tsx";
import { EditToast } from "../../../../../ui/alert/presets/toast/index.ts";
import { useTranslation } from "react-i18next";
import { formatWithUnit } from "../../../../../utils/formatWithUnit.ts";
import { Odometer } from "../../odometer/schemas/odometerSchema.ts";
import { OdometerLimit } from "../../odometer/model/dao/OdometerLogDao.ts";
import dayjs from "dayjs";
import { useDatabase } from "../../../../../contexts/database/DatabaseContext.ts";

type UseFuelLogFormFieldsProps = UseFormReturn<FuelLogFields> & { odometer?: Odometer }

export function useFuelLogFormFields(props: UseFuelLogFormFieldsProps) {
    const { t } = useTranslation();
    const { control, setValue, clearErrors, odometer } = props;
    const { odometerLogDao } = useDatabase();
    const { getCar } = useCars();

    const [car, setCar] = useState<Car | null>(null);
    const [odometerLimit, setOdometerLimit] = useState<OdometerLimit | null>(null);

    const formCarId = useWatch({ control, name: "carId" });
    const formDate = useWatch({ control, name: "date" });

    useEffect(() => {
        const car = getCar(formCarId);
        setCar(car ?? null);
        setValue("ownerId", car?.ownerId);
        setValue("fuelUnitId", car?.fuelTank.unit.id);
        clearErrors();
    }, [formCarId]);

    useEffect(() => {
        (async () => {
            if(!formCarId || !formDate) return;

            setOdometerLimit(await odometerLogDao.getOdometerLimitByDate(formCarId, formDate));
        })();

        setOdometerLimit();
    }, [formCarId, formDate]);

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
        [FuelLogFormFieldsEnum.DateAndOdometerValue]: {
            render: () => <>
                <OdometerValueInput
                    control={ control }
                    odometerValueFieldName="odometerValue"
                    dateFieldName="date"
                    odometerValueSubtitle={ odometer ? t(
                        "odometer.original_value",
                        { value: formatWithUnit(odometer.value, odometer.unit.short) }
                    ) : odometerLimit && t(
                        "odometer.limit",
                        {
                            value: formatWithUnit(odometerLimit.min.value, odometerLimit.unitText),
                            date: dayjs(odometerLimit.min.date).format("L")
                        }
                    ) }
                    currentOdometerValue={ car?.odometer.value }
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