import React from "react";
import { Platform, StyleSheet, useWindowDimensions, View } from "react-native";
import { ScreenScrollView } from "../components/screenView/ScreenScrollView.tsx";
import Garage from "../features/car/components/Garage";
import { LatestExpenses } from "../features/expense/components/LatestExpense.tsx";
import { DEFAULT_SEPARATOR, GLOBAL_STYLE, SEPARATOR_SIZES } from "../constants";
import { ServiceForecastView } from "../features/statistics/components/forecasts/ServiceForecastView.tsx";
import { useSelectedCarId } from "../features/car/hooks/useSelectedCarId.ts";
import { UpcomingRides } from "../features/ride/components/UpcomingRides.tsx";

export function HomeScreen() {
    const { selectedCarId } = useSelectedCarId();
    const { width } = useWindowDimensions();
    const desktop = Platform.OS === "web" && width >= 1040;

    return (
        <ScreenScrollView style={ { paddingHorizontal: 0 } }>
            <Garage/>
            <View style={ [styles.contentContainer, desktop && styles.desktopContentContainer] }>
                {
                    selectedCarId &&
                   <>
                      <UpcomingRides carId={ selectedCarId }
                                     containerStyle={ desktop ? styles.desktopHalf : undefined }/>
                      <LatestExpenses carId={ selectedCarId }
                                      containerStyle={ desktop ? styles.desktopHalf : undefined }/>
                      <ServiceForecastView
                         carId={ selectedCarId }
                         expandable={ true }
                         containerStyle={ desktop ? styles.desktopFull : undefined }
                      />
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
    },
    desktopContentContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "flex-start",
        columnGap: SEPARATOR_SIZES.medium,
        rowGap: SEPARATOR_SIZES.medium
    },
    desktopHalf: {
        width: "48%",
        alignSelf: "flex-start",
        minHeight: 108,
        flexGrow: 1,
        flexShrink: 1,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#303133",
        backgroundColor: "#1B1C1E",
        padding: SEPARATOR_SIZES.small
    },
    desktopFull: {
        width: "100%",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#303133",
        backgroundColor: "#1B1C1E",
        padding: SEPARATOR_SIZES.small
    }
});
