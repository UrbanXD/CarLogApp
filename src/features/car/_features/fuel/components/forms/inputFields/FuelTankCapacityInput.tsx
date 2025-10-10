import Input from "../../../../../../../components/Input/Input.ts";
import { ICON_NAMES, SEPARATOR_SIZES } from "../../../../../../../constants/index.ts";
import React from "react";
import { Control } from "react-hook-form";
import { View } from "react-native";
import { OdometerUnitText } from "../../../../odometer/components/UnitText.tsx";

type FuelTankCapacityInputProps = {
    control: Control<any>
    fieldName: string
    title?: string
    subtitle?: string
    unitText?: string
}

export function FuelTankCapacityInput({
    control,
    fieldName,
    title = "Üzemanyagtartály Térfogat",
    subtitle,
    unitText
}: FuelTankCapacityInputProps) {
    return (
        <Input.Field
            control={ control }
            fieldName={ fieldName }
            fieldNameText={ title }
            fullWidth={ subtitle }
        >
            <Input.Row style={ { gap: 0 } }>
                <View style={ { flex: 1 } }>
                    <Input.Text
                        icon={ ICON_NAMES.odometer }
                        placeholder={ "1000" }
                        numeric
                        type="secondary"
                    />
                </View>
                {
                    unitText &&
                   <OdometerUnitText
                      text={ unitText }
                      style={ { padding: SEPARATOR_SIZES.lightSmall } }
                   />
                }
            </Input.Row>
        </Input.Field>
    );
}