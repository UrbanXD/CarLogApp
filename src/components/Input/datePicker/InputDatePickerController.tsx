import { Pressable, StyleSheet, Text, View } from "react-native";
import { ICON_NAMES, SEPARATOR_SIZES } from "../../../constants/index.ts";
import { InputRow } from "../common/InputRow.tsx";
import React, { useCallback } from "react";
import Divider from "../../Divider.tsx";
import { formTheme } from "../../../ui/form/constants/theme.ts";
import { DatePickerViews } from "../../../contexts/datePicker/DatePickerContext.ts";
import dayjs from "dayjs";
import Icon from "../../Icon.tsx";
import { useTranslation } from "react-i18next";

type InputDatePickerControllerProps = {
    date: Array<Date>
    mode: "single" | "range"
    open: (view: DatePickerViews) => void
}

export function InputDatePickerController({ date, mode, open }: InputDatePickerControllerProps) {
    const { t } = useTranslation();

    const is12HourFormat = dayjs().localeData().longDateFormat("LT").includes("A");

    const onPressDate = useCallback(() => open("calendar"));
    const onPressTime = useCallback(() => open("time"));

    const styles = useStyles(is12HourFormat);

    return (
        <InputRow>
            <Pressable
                onPress={ onPressDate }
                style={ [styles.container, styles.dateContainer] }
            >
                <View style={ styles.iconContainer }>
                    <Icon icon={ ICON_NAMES.calendar } size={ formTheme.iconSize } color={ formTheme.valueTextColor }/>
                </View>
                <Text
                    numberOfLines={ 1 }
                    adjustsFontSizeToFit
                    style={ [styles.text, !date && styles.placeholder] }
                >
                    {
                        date.length > 0
                        ? mode === "single"
                          ? dayjs(date[0]).format("L")
                          : date.map(d => dayjs(d).format("L")).join(" - ")
                        : t("form.date_picker.date_placeholder")
                    }
                </Text>
            </Pressable>
            {
                mode === "single" &&
               <>
                  <Divider isVertical size={ formTheme.containerHeight } color={ formTheme.activeColor }/>
                  <Pressable
                     onPress={ onPressTime }
                     style={ [styles.container, styles.timeContainer] }
                  >
                     <Text
                        numberOfLines={ 1 }
                        adjustsFontSizeToFit
                        style={ [styles.text, !date && styles.placeholder] }
                     >
                         {
                             date
                             ? dayjs(date).format("LT")
                             : t("form.date_picker.time_placeholder")
                         }
                     </Text>
                     <View style={ styles.iconContainer }>
                        <Icon icon={ ICON_NAMES.clock } size={ formTheme.iconSize } color={ formTheme.valueTextColor }/>
                     </View>
                  </Pressable>
               </>
            }
        </InputRow>
    );
}

const useStyles = (is12HourFormat: boolean) => StyleSheet.create({
    container: {
        flexDirection: "row",
        gap: SEPARATOR_SIZES.lightSmall / 2,
        alignItems: "center",
        justifyContent: "flex-start",
        overflow: "hidden"
    },
    dateContainer: {
        flex: 1
    },
    timeContainer: {
        flex: is12HourFormat ? 0.55 : 0.45,
        justifyContent: "flex-end"
    },
    text: {
        color: formTheme.valueTextColor,
        fontSize: formTheme.valueTextFontSize,
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 1
    },
    placeholder: {
        color: formTheme.placeHolderColor
    },
    iconContainer: {
        width: formTheme.iconSize,
        alignItems: "center"
    }
});