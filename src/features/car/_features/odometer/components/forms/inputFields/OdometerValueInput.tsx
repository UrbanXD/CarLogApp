import React from "react";
import { Control } from "react-hook-form";
import Input from "../../../../../../../components/Input/Input.ts";
import { ICON_NAMES, SEPARATOR_SIZES } from "../../../../../../../constants/index.ts";
import { View } from "react-native";
import { UnitText } from "../../../../../../../components/UnitText.tsx";

type OdometerValueInputProps = {
    control: Control<any>
    fieldName: string
    title?: string
    subtitle?: string
    placeholder?: string
    currentOdometerValue?: number
    unitText?: string
}

export function OdometerValueInput({
    control,
    fieldName,
    title = "Kilométeróra-állás",
    subtitle,
    placeholder = "100000",
    currentOdometerValue,
    unitText
}: OdometerValueInputProps) {
    return (
        <Input.Field
            control={ control }
            fieldName={ fieldName }
            fieldNameText={ title }
            fieldInfoText={ subtitle ?? (currentOdometerValue && `A jelenlegi kilométeróra-állás: ${ currentOdometerValue } ${ unitText }`) }
        >
            <Input.Row style={ { gap: 0 } }>
                <View style={ { flex: 1 } }>
                    <Input.Text
                        icon={ ICON_NAMES.odometer }
                        placeholder={ placeholder }
                        numeric
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
    );
}