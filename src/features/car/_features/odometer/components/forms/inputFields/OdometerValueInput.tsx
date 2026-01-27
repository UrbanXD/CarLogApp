import React, { useCallback, useEffect, useMemo } from "react";
import {
    Control,
    FieldPath,
    FieldPathByValue,
    FieldValues,
    UseFormGetFieldState,
    UseFormSetValue,
    useWatch
} from "react-hook-form";
import Input from "../../../../../../../components/Input/Input.ts";
import { ICON_NAMES, SEPARATOR_SIZES } from "../../../../../../../constants";
import { View } from "react-native";
import { UnitText } from "../../../../../../../components/UnitText.tsx";
import { useTranslation } from "react-i18next";
import { formTheme } from "../../../../../../../ui/form/constants/theme.ts";
import InputDatePicker from "../../../../../../../components/Input/datePicker/InputDatePicker.tsx";
import { formatWithUnit } from "../../../../../../../utils/formatWithUnit.ts";
import dayjs from "dayjs";
import { useDatabase } from "../../../../../../../contexts/database/DatabaseContext.ts";
import { useWatchedQueryItem } from "../../../../../../../database/hooks/useWatchedQueryItem.ts";
import { useCar } from "../../../../../hooks/useCar.ts";

type OdometerValueInputProps<FormFieldValues extends FieldValues> = {
    control: Control<FormFieldValues>
    setValue: UseFormSetValue<FormFieldValues>
    getFieldState: UseFormGetFieldState<FormFieldValues>
    odometerValueFieldName: FieldPath<FormFieldValues>
    idFieldName?: FieldPath<FormFieldValues>
    carIdFieldName?: FieldPathByValue<FormFieldValues, string>
    odometerValueTitle?: string
    odometerValueSubtitle?: string
    odometerValueOptional?: boolean
    odometerValuePlaceholder?: string
    dateFieldName?: FieldPath<FormFieldValues>
    dateTitle?: string
    dateSubtitle?: string
    currentOdometerValue?: number
    currentOdometerValueTranslationKey?: string
    showCurrentOdometerValueAsSubtitle?: boolean
    showLimits?: boolean
    skipLimitLogFieldNames?: Array<FieldPath<FormFieldValues>>
    changeCarOdometerValueWhenInputNotTouched?: boolean
    onValueChange?: (value: number) => void
}

export function OdometerValueInput<FormFieldValues extends FieldValues>({
    control,
    setValue,
    getFieldState,
    idFieldName,
    odometerValueFieldName,
    carIdFieldName,
    odometerValueTitle,
    odometerValueSubtitle,
    odometerValueOptional,
    odometerValuePlaceholder = "100000",
    dateFieldName,
    dateTitle,
    dateSubtitle,
    currentOdometerValue,
    currentOdometerValueTranslationKey,
    showCurrentOdometerValueAsSubtitle = false,
    showLimits = true,
    skipLimitLogFieldNames,
    changeCarOdometerValueWhenInputNotTouched = true,
    onValueChange
}: OdometerValueInputProps<FormFieldValues>) {
    const { t } = useTranslation();
    const { odometerLogDao } = useDatabase();

    const formId = useWatch({ control, name: idFieldName ?? "" as FieldPath<FormFieldValues> });
    const formCarId = useWatch({ control, name: carIdFieldName ?? "" as FieldPath<FormFieldValues> });
    const formOdometerValue = useWatch({ control, name: odometerValueFieldName });
    const formDate = useWatch({ control, name: dateFieldName ?? "" as FieldPath<FormFieldValues> });
    const formSkipLimitLogs = useWatch({ control, name: skipLimitLogFieldNames ?? [] });

    const memoizedLimitQuery = useMemo(() => odometerLogDao.odometerLimitWatchedQueryItem(
        formCarId,
        formDate,
        formSkipLimitLogs && formSkipLimitLogs.length > 0 ? [formId, ...formSkipLimitLogs] : [formId],
        showLimits && formCarId
    ), [odometerLogDao, formId, formCarId, formDate, formSkipLimitLogs, showLimits]);
    const { data: odometerLimit } = useWatchedQueryItem(memoizedLimitQuery);
    const { car } = useCar({ carId: formCarId, options: { queryOnce: true } });

    useEffect(() => {
        if(changeCarOdometerValueWhenInputNotTouched && !odometerValueOptional && car && car.id === formCarId && !getFieldState(
            odometerValueFieldName).isDirty) {
            setValue(odometerValueFieldName, car.odometer.value as any);
        }
    }, [formCarId, car?.id, car?.odometer?.value, changeCarOdometerValueWhenInputNotTouched]);

    useEffect(() => {
        if(onValueChange && formOdometerValue) onValueChange(formOdometerValue);
    }, [onValueChange, formOdometerValue]);

    const getSubtitle = useCallback(
        () => {
            if(odometerValueSubtitle) return odometerValueSubtitle;

            if(showLimits && odometerLimit) {
                let subtitle;

                if(odometerLimit.min) {
                    subtitle =
                        dayjs(odometerLimit.min.date).isValid()
                        ?
                        t(
                            "odometer.min_limit",
                            {
                                value: formatWithUnit(odometerLimit.min.value, odometerLimit.unitText),
                                date: dayjs(odometerLimit.min.date).format("L")
                            }
                        )
                        :
                        t(
                            "odometer.min_limit_without_date",
                            { value: formatWithUnit(odometerLimit.min.value, odometerLimit.unitText) }
                        );
                }

                if(odometerLimit.max) {
                    const maxLimitText =
                        dayjs(odometerLimit.max.date).isValid()
                        ?
                        t(
                            "odometer.max_limit",
                            {
                                value: formatWithUnit(odometerLimit.max.value, odometerLimit.unitText),
                                date: dayjs(odometerLimit.max.date).format("L")
                            }
                        )
                        :
                        t(
                            "odometer.max_limit_without_date",
                            { value: formatWithUnit(odometerLimit.max.value, odometerLimit.unitText) }
                        );

                    if(subtitle) {
                        subtitle += `\n${ maxLimitText }`;
                    } else {
                        subtitle = maxLimitText;
                    }
                }

                return subtitle;
            }

            if(showCurrentOdometerValueAsSubtitle && (car || currentOdometerValue)) {
                return t(
                    currentOdometerValueTranslationKey ?? "odometer.current_value",
                    {
                        value: formatWithUnit(
                            currentOdometerValue ?? car?.odometer.value ?? 0,
                            car?.odometer.unit.short
                        )
                    }
                );
            }

            return undefined;
        },
        [
            t,
            odometerValueSubtitle,
            odometerLimit,
            showLimits,
            car,
            currentOdometerValue,
            showCurrentOdometerValueAsSubtitle,
            currentOdometerValueTranslationKey
        ]
    );

    return (
        <View style={ { gap: formTheme.gap } }>
            {
                dateFieldName &&
               <Input.Field
                  control={ control }
                  fieldName={ dateFieldName }
                  fieldNameText={ dateTitle ?? t("date.text") }
                  fieldInfoText={ dateSubtitle }
               >
                  <InputDatePicker/>
               </Input.Field>
            }
            <Input.Field
                control={ control }
                fieldName={ odometerValueFieldName }
                fieldNameText={ odometerValueTitle ?? t("odometer.value") }
                fieldInfoText={ getSubtitle() }
                optional={ odometerValueOptional }
            >
                <Input.Row style={ { gap: 0 } }>
                    <View style={ { flex: 1 } }>
                        <Input.Text
                            icon={ ICON_NAMES.odometer }
                            placeholder={ odometerValuePlaceholder }
                            keyboardType="numeric"
                            type="secondary"
                        />
                    </View>
                    {
                        car &&
                       <UnitText
                          text={ car.odometer.unit.short }
                          style={ { padding: SEPARATOR_SIZES.lightSmall } }
                       />
                    }
                </Input.Row>
            </Input.Field>
        </View>
    );
}