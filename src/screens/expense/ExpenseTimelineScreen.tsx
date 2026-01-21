import React from "react";
import { ExpenseTimeline } from "../../features/expense/components/ExpenseTimeline.tsx";
import { ScreenView } from "../../components/screenView/ScreenView.tsx";
import { FirstSelectCar } from "../../components/firstSelectCar/FirstSelectCar.tsx";
import { useSelectedCarId } from "../../features/car/hooks/useSelectedCarId.ts";

export function ExpenseTimelineScreen() {
    const { selectedCarId } = useSelectedCarId();

    if(!selectedCarId) return <FirstSelectCar/>;

    return (
        <ScreenView>
            <ExpenseTimeline carId={ selectedCarId }/>
        </ScreenView>
    );
}