import React from "react";
import { Control } from "react-hook-form";
import Input from "../../../../../../../components/Input/Input.ts";
import { ICON_NAMES, SEPARATOR_SIZES } from "../../../../../../../constants/index.ts";
import { View } from "react-native";
import { UnitText } from "../../../../../../../components/UnitText.tsx";
import { useTranslation } from "react-i18next";
import { formTheme } from "../../../../../../../ui/form/constants/theme.ts";
import InputDatePicker from "../../../../../../../components/Input/datePicker/InputDatePicker.tsx";
import { formatWithUnit } from "../../../../../../../utils/formatWithUnit.ts";
import { OdometerLimit } from "../../../model/dao/OdometerLogDao.ts";
import dayjs from "dayjs";

type OdometerValueInputProps = {
    control: Control<any>
    odometerValueFieldName: string
    odometerValueTitle?: string
    odometerValueSubtitle?: string
    odometerValueOptional?: boolean
    odometerValuePlaceholder?: string
    dateFieldName?: string
    dateTitle?: string
    dateSubtitle?: string
    currentOdometerValueTranslationKey?: string
    currentOdometerValue?: number
    odometerLimit?: OdometerLimit | null
    unitText?: string
}

export function OdometerValueInput({
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
    unitText
}: OdometerValueInputProps) {
    const { t } = useTranslation();

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
                fieldInfoText={
                    odometerValueSubtitle
                    ??
                    (
                        odometerLimit && (
                            odometerLimit.min?.date &&
                            dayjs(odometerLimit.min.date).isValid()
                            ?
                            t(
                                "odometer.limit",
                                {
                                    value: formatWithUnit(odometerLimit.min.value ?? 0, odometerLimit.unitText),
                                    date: dayjs(odometerLimit.min.date).format("L")
                                }
                            )
                            :
                            t(
                                "odometer.limit_without_date",
                                { value: formatWithUnit(odometerLimit.min?.value ?? 0, odometerLimit.unitText) }
                            )
                        )
                    )
                    ??
                    (
                        currentOdometerValue &&
                        t(
                            currentOdometerValueTranslationKey ?? "odometer.current_value",
                            { value: formatWithUnit(currentOdometerValue, unitText) }
                        )
                    )
                }
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