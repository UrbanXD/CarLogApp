import React, { useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { FilterRow } from "../components/filter/FilterRow.tsx";
import { COLORS, FONT_SIZES, FULL_TABBAR_HEIGHT, SEPARATOR_SIZES } from "../constants";
import dayjs from "dayjs";
import InputDatePicker, { InputDatePickerRef } from "../components/Input/datePicker/InputDatePicker.tsx";
import { FuelStatistics } from "../features/statistics/components/stats/FuelStatistics.tsx";
import { ExpenseStatistics } from "../features/statistics/components/stats/ExpenseStatistics.tsx";
import { ServiceStatistics } from "../features/statistics/components/stats/ServiceStatistics.tsx";
import { RideStatistics } from "../features/statistics/components/stats/RideStatistics.tsx";
import { useTranslation } from "react-i18next";
import OnBoardingView from "../components/OnBoardingView.tsx";
import { FirstSelectCar } from "../components/firstSelectCar/FirstSelectCar.tsx";
import { useSelectedCarId } from "../features/car/hooks/useSelectedCarId.ts";
import { ScreenView } from "../components/screenView/ScreenView.tsx";
import { ScrollView } from "react-native-gesture-handler";

const STAT_TYPES = ["fuel", "ride", "expense", "service"];

export function StatisticsScreen() {
    const { selectedCarId } = useSelectedCarId();
    const { t } = useTranslation();

    const datePickerRef = useRef<InputDatePickerRef>(null);

    const [currentBoardIndex, setCurrentBoardIndex] = useState<number>(0);

    const [from, setFrom] = useState(dayjs().subtract(1, "month").toISOString());
    const [to, setTo] = useState(dayjs().toISOString()); //now

    const openDateRangePicker = () => datePickerRef?.current?.open("calendar");

    const boards = useMemo(() => ([
        () => (
            <FuelStatistics
                carId={ selectedCarId }
                from={ from }
                to={ to }
            />
        ),
        () => (
            <RideStatistics
                carId={ selectedCarId }
                from={ from }
                to={ to }
            />
        ),
        () => (
            <ExpenseStatistics
                carId={ selectedCarId }
                from={ from }
                to={ to }
            />
        ),
        () => (
            <ServiceStatistics
                carId={ selectedCarId }
                from={ from }
                to={ to }
            />
        )
    ]), [selectedCarId, from, to]);

    if(!selectedCarId) return <FirstSelectCar/>;

    return (
        <ScreenView>
            <InputDatePicker
                ref={ datePickerRef }
                mode="range"
                defaultStartDate={ from }
                defaultEndDate={ to }
                hiddenController
                setValue={
                    (date: string | Array<string>) => {
                        if(Array.isArray(date)) {
                            setFrom(date[0]);
                            setTo(date[1]);
                        }
                    }
                }
            />
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
            <ScrollView
                style={ { gap: SEPARATOR_SIZES.lightSmall } }
                contentContainerStyle={ { paddingBottom: FULL_TABBAR_HEIGHT } }
                showsVerticalScrollIndicator={ false }
            >
                <OnBoardingView steps={ boards } currentStep={ currentBoardIndex }/>
            </ScrollView>
        </ScreenView>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: SEPARATOR_SIZES.lightSmall
    },
    header: {
        gap: SEPARATOR_SIZES.lightSmall / 2,
        paddingBottom: SEPARATOR_SIZES.lightSmall
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