import React from "react";
import { Control } from "react-hook-form";
import Input from "../../../../../../../components/Input/Input.ts";
import { ICON_NAMES, SEPARATOR_SIZES } from "../../../../../../../constants/index.ts";
import { View } from "react-native";
import { UnitText } from "../../../../../../../components/UnitText.tsx";
import { useTranslation } from "react-i18next";
import { formTheme } from "../../../../../../../ui/form/constants/theme.ts";
import InputDatePicker from "../../../../../../../components/Input/datePicker/InputDatePicker.tsx";

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
    currentOdometerValue?: number
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
    currentOdometerValue,
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
                fieldInfoText={ odometerValueSubtitle ?? (currentOdometerValue && `A jelenlegi kilométeróra-állás: ${ currentOdometerValue } ${ unitText }`) }
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