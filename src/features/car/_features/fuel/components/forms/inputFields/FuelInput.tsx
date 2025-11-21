import React, { useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES } from "../../../../../../../constants/index.ts";
import Input from "../../../../../../../components/Input/Input.ts";
import { Control, UseFormSetValue, useWatch } from "react-hook-form";
import { formTheme } from "../../../../../../../ui/form/constants/theme.ts";
import i18n from "../../../../../../../i18n/index.ts";

type FuelInputProps = {
    control: Control<any>
    setValue: UseFormSetValue<any>
    fieldName: string
    title?: string
    subtitle?: string
    capacity: number
    fuelTypeText?: string
    unitText?: string
}

export function FuelInput({
    control,
    setValue,
    fieldName,
    title = i18n.t("fuel.tank"),
    subtitle,
    capacity,
    fuelTypeText,
    unitText
}: FuelInputProps) {
    const fuelValue = useWatch({ control, name: fieldName });

    const fuelingToFull = useCallback(() => {
        if(fuelValue === capacity) return;

        setValue(fieldName, capacity);
    }, [fuelValue, capacity, setValue, fieldName]);

    const modifyFuelValue = useCallback((value: number) => {
        if(value === 0) return;
        if(value > 0 && fuelValue === capacity) return;
        if(value < 0 && fuelValue === 0) return;

        setValue(fieldName, Math.min(capacity, Math.max(0, fuelValue + value)));
    });

    const getFieldNameText = useCallback(() => {
        let fieldNameText = title;
        if(!fieldNameText && fuelTypeText) fieldNameText = fuelTypeText;
        if(fieldNameText && fuelTypeText) fieldNameText += ` (${ fuelTypeText })`;


        return fieldNameText;
    }, [title, fuelTypeText]);

    const stepperButtons = [-10, -1, +1, +10];

    return (
        <Input.Field
            control={ control }
            fieldName={ fieldName }
            fieldNameText={ getFieldNameText() }
            fieldInfoText={ subtitle }
            containerStyle={ { gap: SEPARATOR_SIZES.lightSmall } }
        >
            <View style={ styles.actionContainer }>
                <View style={ styles.actionContainer.stepperButtons }>
                    {
                        stepperButtons.map((step, index) => (
                            <React.Fragment key={ index }>
                                <Pressable
                                    onPress={ () => modifyFuelValue(step) }
                                    style={ styles.actionContainer.stepperButtons.button }
                                >
                                    <Text style={ styles.actionContainer.stepperButtons.button.text }>
                                        { step > 0 ? `+${ step }` : step }
                                    </Text>
                                </Pressable>
                                {
                                    Math.floor(stepperButtons.length / 2) === index + 1 &&
                                   <Text style={ styles.actionContainer.stepperButtons.button.text }>
                                       { unitText }
                                   </Text>
                                }
                            </React.Fragment>
                        ))
                    }
                </View>
                <Pressable
                    onPress={ fuelingToFull }
                    style={ [
                        styles.actionContainer.stepperButtons.button,
                        styles.actionContainer.stepperButtons.fullTankButton
                    ] }
                >
                    <Text style={ [
                        styles.actionContainer.stepperButtons.button.text,
                        styles.actionContainer.stepperButtons.fullTankButton.text
                    ] }
                    >
                        { t("fuel.full_tank") }
                    </Text>
                </Pressable>
            </View>
            <Input.Slider
                minValue={ 0 }
                maxValue={ capacity }
                unit={ unitText }
                tooltipAsInputField={ true }
                style={ {
                    showsHandle: false,
                    showsTag: true,
                    showsPercent: true,
                    innerTooltip: true,
                    borderRadius: 0,
                    trackBorderWidth: 0,
                    barColor: [
                        { color: "#FF3B30", percent: 0 },
                        { color: "#FFCC00", percent: 45 },
                        { color: "#02c227", percent: 75 },
                        { color: "#02a121", percent: 100 }
                    ],
                    tooltipColor: COLORS.gray5,
                    trackHeight: formTheme.containerHeight
                } }
            />
        </Input.Field>
    );
};

const styles = StyleSheet.create({
    actionContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: SEPARATOR_SIZES.lightSmall,

        stepperButtons: {
            flexDirection: "row",
            flexWrap: "wrap",
            gap: SEPARATOR_SIZES.lightSmall,

            button: {
                backgroundColor: COLORS.gray4,
                paddingVertical: SEPARATOR_SIZES.lightSmall / 2,
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: SEPARATOR_SIZES.lightSmall,
                borderRadius: 8,

                text: {
                    fontFamily: "Gilroy-Medium",
                    fontSize: FONT_SIZES.p4,
                    letterSpacing: FONT_SIZES.p4 * 0.05,
                    color: COLORS.gray1,
                    flexShrink: 1,
                    alignSelf: "center"
                }
            },

            fullTankButton: {
                backgroundColor: COLORS.fuelYellow,

                text: {
                    color: COLORS.black
                }
            }
        }
    }
});