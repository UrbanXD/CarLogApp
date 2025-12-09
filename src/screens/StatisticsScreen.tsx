import React, { useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ScreenScrollView } from "../components/screenView/ScreenScrollView.tsx";
import { FilterRow } from "../components/filter/FilterRow.tsx";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES } from "../constants/index.ts";
import dayjs from "dayjs";
import InputDatePicker, { InputDatePickerRef } from "../components/Input/datePicker/InputDatePicker.tsx";
import useCars from "../features/car/hooks/useCars.ts";
import { FuelStatistics } from "../features/statistics/components/stats/FuelStatistics.tsx";
import { ExpenseStatistics } from "../features/statistics/components/stats/ExpenseStatistics.tsx";
import { ServiceStatistics } from "../features/statistics/components/stats/ServiceStatistics.tsx";
import { RideStatistics } from "../features/statistics/components/stats/RideStatistics.tsx";
import { useTranslation } from "react-i18next";
import OnBoardingView from "../components/OnBoardingView.tsx";

const STAT_TYPES = ["fuel", "ride", "expense", "service"];

export function StatisticsScreen() {
    const { selectedCar } = useCars();
    const { t } = useTranslation();

    const datePickerRef = useRef<InputDatePickerRef>();

    const [currentBoardIndex, setCurrentBoardIndex] = useState<number>(0);
    const [selectedStatType, setSelectedStatType] = useState(STAT_TYPES[1]); // Fogyasztás

    const [from, setFrom] = useState(dayjs().subtract(1, "month").toISOString());
    const [to, setTo] = useState(dayjs().toISOString()); //now

    const openDateRangePicker = () => datePickerRef?.current?.open();

    const boards = useMemo(() => ([
        () => (
            <FuelStatistics
                carId={ selectedCar?.id }
                from={ from }
                to={ to }
            />
        ),
        () => (
            <RideStatistics
                carId={ selectedCar?.id }
                from={ from }
                to={ to }
            />
        ),
        () => (
            <ExpenseStatistics
                carId={ selectedCar?.id }
                from={ from }
                to={ to }
            />
        ),
        () => (
            <ServiceStatistics
                carId={ selectedCar?.id }
                from={ from }
                to={ to }
            />
        )
    ]), [selectedCar, from, to]);

    return (
        <ScreenScrollView>
            <InputDatePicker
                ref={ datePickerRef }
                mode="range"
                defaultStartDate={ from }
                defaultEndDate={ to }
                hiddenController
                setValue={
                    (date: Array<Date>) => {
                        setFrom(date[0].toISOString());
                        setTo(date[1].toISOString());
                    }
                }
            />
            <View style={ styles.container }>
                <View style={ styles.header }>
                    <FilterRow style={ styles.statTypeFilterContainer }>
                        {
                            STAT_TYPES.map((stat, index) => (
                                <Pressable
                                    key={ index }
                                    style={ [
                                        styles.statTypeFilterButton,
                                        currentBoardIndex === index && styles.statTypeFilterActive
                                    ] }
                                    onPress={ () => setCurrentBoardIndex(index) }
                                >
                                    <Text style={ styles.statTypeFilterText }>
                                        { t(`statistics.types.${ stat }`) }
                                    </Text>
                                </Pressable>
                            ))
                        }
                    </FilterRow>
                    <Pressable onPress={ openDateRangePicker }>
                        <View style={ styles.rangeContainer }>
                            <Text style={ styles.rangeText }>
                                { dayjs(from).format("LL") }
                            </Text>
                            <Text style={ styles.arrow }>→</Text>
                            <Text style={ styles.rangeText }>
                                { dayjs(to).format("LL") }
                            </Text>
                        </View>
                        <Text style={ styles.agoText }>
                            { dayjs(from).from(dayjs(to)) }
                        </Text>
                    </Pressable>
                </View>
                <OnBoardingView steps={ boards } currentStep={ currentBoardIndex }/>
            </View>
        </ScreenScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: SEPARATOR_SIZES.lightSmall
    },
    header: {
        gap: SEPARATOR_SIZES.lightSmall / 2
    },
    statTypeFilterContainer: {
        backgroundColor: COLORS.gray5,
        borderRadius: 12,
        gap: 0,
        paddingHorizontal: 0
    },
    statTypeFilterButton: {
        flexGrow: 1,
        borderRadius: 12,
        paddingVertical: SEPARATOR_SIZES.lightSmall,
        paddingHorizontal: SEPARATOR_SIZES.small
    },
    statTypeFilterActive: {
        backgroundColor: COLORS.gray3
    },
    statTypeFilterText: {
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.p4,
        color: COLORS.white,
        textAlign: "center"
    },
    rangeContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginTop: 2
    },
    rangeText: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p4,
        color: COLORS.gray1
    },
    arrow: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p4,
        color: COLORS.gray2
    },
    agoText: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p4 * 0.85,
        color: COLORS.gray1
    }
});