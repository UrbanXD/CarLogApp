import React from "react";
import { ExpenseTimeline } from "../../features/expense/components/ExpenseTimeline.tsx";
import useCars from "../../features/car/hooks/useCars.ts";
import { ScreenView } from "../../components/screenView/ScreenView.tsx";
import { FirstSelectCar } from "../../components/firstSelectCar/FirstSelectCar.tsx";

export function ExpenseTimelineScreen() {
    const { selectedCar } = useCars();

    if(!selectedCar) return <FirstSelectCar/>;

    return (
        <ScreenView>
            <ExpenseTimeline car={ selectedCar }/>
        </ScreenView>
    );
}