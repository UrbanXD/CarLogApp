import React, { useCallback, useEffect, useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES } from "../../../../../../../constants";
import Input from "../../../../../../../components/Input/Input.ts";
import { Control, FieldPathByValue, FieldValues, UseFormSetValue, useWatch } from "react-hook-form";
import { formTheme } from "../../../../../../../ui/form/constants/theme.ts";
import { useTranslation } from "react-i18next";
import { useCar } from "../../../../../hooks/useCar.ts";

type FuelInputProps<FormFieldValues extends FieldValues> = {
    control: Control<FormFieldValues>
    setValue: UseFormSetValue<FormFieldValues>
    fieldName: FieldPathByValue<FormFieldValues, number>
    fuelUnitIdFieldName: FieldPathByValue<FormFieldValues, number>
    carIdFieldName: FieldPathByValue<FormFieldValues, string>
    title?: string
    subtitle?: string
}

export function FuelInput<FormFieldValues extends FieldValues>({
    control,
    setValue,
    fieldName,
    fuelUnitIdFieldName,
    carIdFieldName,
    title,
    subtitle
}: FuelInputProps<FormFieldValues>) {
    const { t } = useTranslation();

    const formCarId = useWatch({ control, name: carIdFieldName });
    const fuelValue = useWatch({ control, name: fieldName });

    const { car } = useCar({ carId: formCarId, options: { queryOnce: true } });
    const capacity = useMemo(() => car?.fuelTank.capacity ?? 0, [car?.fuelTank.capacity]);

    useEffect(() => {
        if(car && car.id === formCarId) {
            setValue(fuelUnitIdFieldName, car.fuelTank.unit.id as any);
        }
    }, [car, formCarId, setValue]);

    const fuelingToFull = useCallback(() => {
        if(fuelValue === capacity) return;

        setValue(fieldName, capacity as any);
    }, [fuelValue, capacity, setValue, fieldName]);

    const modifyFuelValue = useCallback((value: number) => {
        if(value === 0) return;
        if(value > 0 && fuelValue === capacity) return;
        if(value < 0 && fuelValue === 0) return;

        setValue(fieldName, Math.min(capacity, Math.max(0, fuelValue + value)) as any);
    }, [fuelValue, capacity]);

    const getFieldNameText = useCallback(() => {
        let fieldNameText = title ?? t("fuel.tank");
        const fuelTypeText = car ? t(`fuel.types.${ car.fuelTank.type.key }`) : null;

        if(!fieldNameText && fuelTypeText) fieldNameText = fuelTypeText;
        if(fieldNameText && fuelTypeText) fieldNameText += ` (${ fuelTypeText })`;

        return fieldNameText;
    }, [t, title, car]);

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
                <View style={ styles.stepperButtons }>
                    {
                        stepperButtons.map((step, index) => (
                            <React.Fragment key={ index }>
                                <Pressable
                                    onPress={ () => modifyFuelValue(step) }
                                    style={ styles.button }
                                >
                                    <Text style={ styles.buttonText }>
                                        { step > 0 ? `+${ step }` : step }
                                    </Text>
                                </Pressable>
                                {
                                    Math.floor(stepperButtons.length / 2) === index + 1 && car &&
                                   <Text style={ styles.buttonText }>
                                       { car.fuelTank.unit.short }
                                   </Text>
                                }
                            </React.Fragment>
                        ))
                    }
                </View>
                <Pressable
                    onPress={ fuelingToFull }
                    style={ [styles.button, styles.fullTankButton] }
                >
                    <Text style={ [styles.buttonText, styles.fullTankText] }>
                        { t("fuel.full_tank") }
                    </Text>
                </Pressable>
            </View>
            <Input.Slider
                minValue={ 0 }
                maxValue={ capacity }
                unit={ car?.fuelTank.unit.short }
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
}

const styles = StyleSheet.create({
    actionContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        gap: SEPARATOR_SIZES.lightSmall
    },
    stepperButtons: {
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        gap: SEPARATOR_SIZES.lightSmall
    },

    button: {
        backgroundColor: COLORS.gray4,
        paddingVertical: SEPARATOR_SIZES.lightSmall / 2,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: SEPARATOR_SIZES.lightSmall,
        borderRadius: 8
    },
    buttonText: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p4,
        letterSpacing: FONT_SIZES.p4 * 0.05,
        color: COLORS.gray1,
        flexShrink: 1,
        alignSelf: "center"
    },

    fullTankButton: {
        alignSelf: "center",
        backgroundColor: COLORS.fuelYellow
    },

    fullTankText: {
        color: COLORS.black
    }
});