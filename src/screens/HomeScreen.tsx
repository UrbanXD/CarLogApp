import React from "react";
import { StyleSheet, View } from "react-native";
import useCars from "../features/car/hooks/useCars.ts";
import { ScreenScrollView } from "../components/screenView/ScreenScrollView.tsx";
import Garage from "../features/car/components/Garage.tsx";
import { UpcomingRides } from "../features/ride/components/UpcomingRides.tsx";
import { LatestExpenses } from "../features/expense/components/LatestExpense.tsx";
import { DEFAULT_SEPARATOR, GLOBAL_STYLE, SEPARATOR_SIZES } from "../constants/index.ts";
import { ServiceForecastView } from "../features/statistics/components/forecasts/ServiceForecastView.tsx";

export function HomeScreen() {
    const { selectedCar } = useCars();

    return (
        <ScreenScrollView style={ { paddingHorizontal: 0 } }>
            <Garage/>
            <View style={ styles.contentContainer }>
                <UpcomingRides car={ selectedCar }/>
                <LatestExpenses car={ selectedCar }/>
                <ServiceForecastView carId={ selectedCar?.id }/>
            </View>
        </ScreenScrollView>
    );
};

const styles = StyleSheet.create({
    titleContainer: {
        ...GLOBAL_STYLE.contentContainer,
        paddingHorizontal: DEFAULT_SEPARATOR,
        paddingVertical: 0,
        gap: 0,
        backgroundColor: "transparent"
    },
    contentContainer: {
        marginHorizontal: DEFAULT_SEPARATOR,
        gap: SEPARATOR_SIZES.medium
    }
});