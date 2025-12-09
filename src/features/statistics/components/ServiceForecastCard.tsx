import { ActivityIndicator, LayoutChangeEvent, StyleSheet, Text, View } from "react-native";
import { ServiceTypeEnum } from "../../expense/_features/service/model/enums/ServiceTypeEnum.ts";
import { OdometerText } from "../../car/_features/odometer/components/OdometerText.tsx";
import { ALERT_ICONS, COLORS, FONT_SIZES, ICON_FONT_SIZE_SCALE, SEPARATOR_SIZES } from "../../../constants/index.ts";
import dayjs from "dayjs";
import React, { useCallback, useEffect, useState } from "react";
import { Forecast } from "../model/dao/statisticsDao.ts";
import { useTranslation } from "react-i18next";
import Icon from "../../../components/Icon.tsx";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

const BAR_ANIMATiON_DURATION = 300;

type ForecastCardProps = {
    forecast: Forecast | null
    type: ServiceTypeEnum
    odometer: {
        value: number
        unitText?: string
    }
    isLoading?: boolean
}

export function ServiceForecastCard({
    forecast,
    type,
    odometer,
    isLoading = false
}: ForecastCardProps) {
    const { t } = useTranslation();

    const percentToNextService = useSharedValue(0);

    const [isOverdue, setIsOverdue] = useState(false);
    const [isOdometerViewWrapped, setIsOdometerViewWrapped] = useState(false);

    useEffect(() => {
        if(!forecast) {
            percentToNextService.value = withTiming(0, { duration: BAR_ANIMATiON_DURATION });
            return;
        }

        let percent = !isLoading && forecast
                      ? ((odometer.value - forecast.oldValue) / (forecast.value - forecast.oldValue)) * 100
                      : 0;

        percentToNextService.value = withTiming(
            Math.min(100, Math.max(0, percent)),
            { duration: BAR_ANIMATiON_DURATION }
        );

        setIsOverdue(dayjs().isSame(forecast.date, "date") || dayjs().isAfter(forecast.date, "date"));
    }, [forecast]);

    const onNextOdometerValueViewLayout = useCallback(
        (event: LayoutChangeEvent) => {
            setIsOdometerViewWrapped(event.nativeEvent.layout.y !== 0);
        },
        []
    );

    const animatedBarStyle = useAnimatedStyle(() => {
        return {
            width: `${ percentToNextService.value }%`
        };
    });

    return (
        <View style={ styles.container }>
            <View style={ styles.header }>
                <View style={ styles.titleContainer }>
                    <Text style={ styles.title }>
                        { t(`service.types.${ type }`) }
                    </Text>
                </View>
                <View style={ styles.odometerContainer }>
                    <View style={ styles.odometer }>
                        {
                            isLoading
                            ?
                            <ActivityIndicator
                                size={ "small" }
                                color={ COLORS.gray2 }
                                style={ { alignSelf: "flex-start" } }
                            />
                            :
                            <OdometerText
                                text={ forecast?.oldValue ?? 0 }
                                unit={ odometer.unitText }
                                textStyle={ styles.label }
                                unitTextStyle={ { color: styles.label.color } }
                            />
                        }
                        <Text style={ styles.label }>
                            { t("statistics.service.last_odometer_value") }
                        </Text>
                    </View>
                    <View
                        style={ styles.odometer }
                        onLayout={ onNextOdometerValueViewLayout }
                    >
                        {
                            isLoading
                            ?
                            <ActivityIndicator
                                size={ "small" }
                                color={ COLORS.gray2 }
                                style={ { alignSelf: !isOdometerViewWrapped ? "flex-end" : "flex-start" } }
                            />
                            :
                            <OdometerText
                                text={ forecast?.value ?? 0 }
                                unit={ odometer.unitText }
                                textStyle={ styles.label }
                                unitTextStyle={ { color: styles.label.color } }
                                containerStyle={ !isOdometerViewWrapped && { alignSelf: "flex-end" } }
                            />
                        }
                        <Text style={ [
                            styles.label,
                            !isOdometerViewWrapped && { textAlign: "right" }
                        ] }>
                            { t("statistics.service.forecast_odometer_value") }
                        </Text>
                    </View>
                </View>
            </View>
            <View style={ styles.barContainer }>
                <Animated.View style={ [styles.bar, isOverdue && styles.overdueBar, animatedBarStyle] }/>
            </View>
            {
                forecast?.date === null
                ?
                <Text style={ styles.forecastLabelNotPossible }>
                    { t("statistics.service.forecast_not_possible") }
                </Text>
                :
                <View style={ styles.contentContainer }>
                    <View style={ styles.content }>
                        <View>
                            <Text style={ styles.forecastLabel }>
                                {
                                    isLoading
                                    ?
                                    <ActivityIndicator
                                        size={ "small" }
                                        color={ COLORS.gray2 }
                                        style={ { alignSelf: !isOdometerViewWrapped ? "flex-end" : "flex-start" } }
                                    />
                                    : (
                                        forecast
                                        ? (
                                            isOverdue
                                            ? t("statistics.service.is_on_time")
                                            : dayjs(forecast.date).format("LL")
                                        )
                                        : "-"
                                    )
                                }
                            </Text>
                            {
                                forecast && !isOverdue &&
                               <Text style={ styles.forecastLabelSubtitle }>
                                   { dayjs(forecast.date).fromNow() }
                               </Text>
                            }
                        </View>
                        <Text style={ styles.forecastText }>
                            { t("statistics.service.forecast_date") }
                        </Text>
                    </View>
                    {
                        isOverdue &&
                       <Icon
                          icon={ ALERT_ICONS.warning }
                          size={ FONT_SIZES.p1 * ICON_FONT_SIZE_SCALE }
                          color={ COLORS.fuelYellow }
                       />
                    }
                </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        padding: SEPARATOR_SIZES.small,
        borderRadius: 12,
        backgroundColor: COLORS.gray5,
        shadowColor: COLORS.black,
        shadowOffset: {
            width: 0,
            height: 12
        },
        shadowOpacity: 0.58,
        shadowRadius: 16,
        elevation: 24
    },
    overdueContainer: {
        borderColor: COLORS.fuelYellow
    },
    header: {
        gap: SEPARATOR_SIZES.lightSmall
    },
    titleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: SEPARATOR_SIZES.lightSmall
    },
    odometerContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: SEPARATOR_SIZES.lightSmall
    },
    odometer: {
        flexShrink: 1,
        overflow: "hidden"
    },
    title: {
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.p2,
        color: COLORS.white
    },
    label: {
        fontSize: FONT_SIZES.p4,
        color: COLORS.gray1
    },
    barContainer: {
        position: "relative",
        height: 7.5,
        width: "100%",
        backgroundColor: COLORS.gray2,
        borderRadius: 6,
        marginVertical: SEPARATOR_SIZES.lightSmall
    },
    bar: {
        position: "absolute",
        height: 7.5,
        minWidth: 5,
        backgroundColor: COLORS.white,
        borderRadius: 6
    },
    overdueBar: {
        backgroundColor: COLORS.fuelYellow
    },
    contentContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    content: {
        flexShrink: 1,
        gap: SEPARATOR_SIZES.lightSmall / 2
    },
    forecastLabel: {
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.h3,
        lineHeight: FONT_SIZES.h3,
        color: COLORS.white
    },
    forecastLabelNotPossible: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p2,
        color: COLORS.gray1
    },
    forecastLabelSubtitle: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p3,
        color: COLORS.white
    },
    forecastText: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p3,
        color: COLORS.gray1
    }
});