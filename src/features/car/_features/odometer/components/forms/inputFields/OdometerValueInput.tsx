import React, { useCallback } from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import Input from "../../../../../../../components/Input/Input.ts";
import { ICON_NAMES, SEPARATOR_SIZES } from "../../../../../../../constants";
import { View } from "react-native";
import { UnitText } from "../../../../../../../components/UnitText.tsx";
import { useTranslation } from "react-i18next";
import { formTheme } from "../../../../../../../ui/form/constants/theme.ts";
import InputDatePicker from "../../../../../../../components/Input/datePicker/InputDatePicker.tsx";
import { formatWithUnit } from "../../../../../../../utils/formatWithUnit.ts";
import { OdometerLimit } from "../../../model/dao/OdometerLogDao.ts";
import dayjs from "dayjs";

type OdometerValueInputProps<FormFieldValues extends FieldValues> = {
    control: Control<FormFieldValues>
    odometerValueFieldName: FieldPath<FormFieldValues>
    odometerValueTitle?: string
    odometerValueSubtitle?: string
    odometerValueOptional?: boolean
    odometerValuePlaceholder?: string
    dateFieldName?: FieldPath<FormFieldValues>
    dateTitle?: string
    dateSubtitle?: string
    currentOdometerValueTranslationKey?: string
    currentOdometerValue?: number
    odometerLimit?: OdometerLimit | null
    unitText?: string
    showCurrentOdometerValueAsSubtitle?: boolean
}

export function OdometerValueInput<FormFieldValues extends FieldValues>({
    control,
    odometerValueFieldName,
    odometerValueTitle,
    odometerValueSubtitle,
    odometerValueOptional,
    odometerValuePlaceholder = "100000",
    dateFieldName,
    dateTitle,
    dateSubtitle,
    currentOdometerValueTranslationKey,
    currentOdometerValue,
    odometerLimit,
    unitText,
    showCurrentOdometerValueAsSubtitle = false
}: OdometerValueInputProps<FormFieldValues>) {
    const { t } = useTranslation();

    const getSubtitle = useCallback(
        () => {
            if(odometerValueSubtitle) return odometerValueSubtitle;

            if(odometerLimit) {
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

            if(showCurrentOdometerValueAsSubtitle && currentOdometerValue) {
                return t(
                    currentOdometerValueTranslationKey ?? "odometer.current_value",
                    { value: formatWithUnit(currentOdometerValue, unitText) }
                );
            }

            return undefined;
        },
        [
            t,
            odometerValueSubtitle,
            odometerLimit,
            showCurrentOdometerValueAsSubtitle,
            currentOdometerValue,
            unitText,
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
                        unitText &&
                       <UnitText
                          text={ unitText }
                          style={ { padding: SEPARATOR_SIZES.lightSmall } }
                       />
                    }
                </Input.Row>
            </Input.Field>
        </View>
    );
}