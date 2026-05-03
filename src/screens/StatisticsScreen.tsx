import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { FilterRow } from "../components/filter/FilterRow.tsx";
import { COLORS, FONT_SIZES, FULL_TABBAR_HEIGHT, SEPARATOR_SIZES } from "../constants";
import dayjs from "dayjs";
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
import { DateRangePicker } from "../components/Input/datePicker/presets/DateRangePicker.tsx";

const STAT_TYPES = ["ride", "expense", "fuel", "service"];

export function StatisticsScreen() {
    const { selectedCarId } = useSelectedCarId();
    const { t } = useTranslation();

    const [currentBoardIndex, setCurrentBoardIndex] = useState<number>(0);

    const [from, setFrom] = useState<string | null>(dayjs().subtract(1, "month").toISOString());
    const [to, setTo] = useState<string | null>(dayjs().toISOString()); //now

    const boards = useMemo(() => ([
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
            <FuelStatistics
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
                <DateRangePicker
                    from={ from }
                    to={ to }
                    setFrom={ setFrom }
                    setTo={ setTo }
                />
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
    }
});