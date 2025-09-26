import React from "react";
import { ExpenseTimeline } from "../features/expense/components/ExpenseTimeline.tsx";
import { SafeAreaView } from "react-native-safe-area-context";
import useCars from "../features/car/hooks/useCars.ts";
import { COLORS, DEFAULT_SEPARATOR, SEPARATOR_SIZES, SIMPLE_HEADER_HEIGHT } from "../constants/index.ts";

export function ExpenseTimelineScreen() {
    const { selectedCar } = useCars();

    if(!selectedCar) return <></>; //TODO first select a  car page

    return (
        <SafeAreaView style={ {
            flex: 1,
            paddingTop: SIMPLE_HEADER_HEIGHT,
            paddingHorizontal: DEFAULT_SEPARATOR,
            paddingBottom: SEPARATOR_SIZES.lightSmall,
            backgroundColor: COLORS.black2
        } }>
            <ExpenseTimeline car={ selectedCar }/>
        </SafeAreaView>
    );
}