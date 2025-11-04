import React from "react";
import { StyleSheet, View } from "react-native";
import { DEFAULT_SEPARATOR, GLOBAL_STYLE, SEPARATOR_SIZES } from "../../../constants/index.ts";
import Garage from "../../../features/car/components/Garage.tsx";
import UpcomingRidesBlock from "./UpcomingRidesBlock";
import { ScreenScrollView } from "../../../components/screenView/ScreenScrollView.tsx";
import useCars from "../../../features/car/hooks/useCars.ts";
import { LatestExpenses } from "../../../features/expense/components/LatestExpense.tsx";

const HomeScreen: React.FC = () => {
    const { selectedCar } = useCars();

    return (
        <ScreenScrollView style={ { paddingHorizontal: 0 } }>
            <Garage/>
            <View style={ styles.contentContainer }>
                <UpcomingRidesBlock/>
                <LatestExpenses car={ null }/>
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

export default HomeScreen;