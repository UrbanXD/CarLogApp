import React from "react";
import { StyleSheet, View } from "react-native";
import { ScreenScrollView } from "../components/screenView/ScreenScrollView.tsx";
import Garage from "../features/car/components/Garage.tsx";
import { LatestExpenses } from "../features/expense/components/LatestExpense.tsx";
import { DEFAULT_SEPARATOR, GLOBAL_STYLE, SEPARATOR_SIZES } from "../constants";
import { ServiceForecastView } from "../features/statistics/components/forecasts/ServiceForecastView.tsx";
import { useSelectedCarId } from "../features/car/hooks/useSelectedCarId.ts";
import { UpcomingRides } from "../features/ride/components/UpcomingRides.tsx";

export function HomeScreen() {
    const { selectedCarId } = useSelectedCarId();

    return (
        <ScreenScrollView style={ { paddingHorizontal: 0 } }>
            <Garage/>
            <View style={ styles.contentContainer }>
                {
                    selectedCarId &&
                   <>
                      <UpcomingRides carId={ selectedCarId }/>
                      <LatestExpenses carId={ selectedCarId }/>
                      <ServiceForecastView carId={ selectedCarId } expandable={ true }/>
                   </>
                }
            </View>
        </ScreenScrollView>
    );
}

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