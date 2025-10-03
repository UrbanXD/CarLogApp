import React from "react";
import { ExpenseTimeline } from "../../features/expense/components/ExpenseTimeline.tsx";
import useCars from "../../features/car/hooks/useCars.ts";
import { ScreenView } from "../../components/screenView/ScreenView.tsx";

export function ExpenseTimelineScreen() {
    const { selectedCar } = useCars();

    if(!selectedCar) return <></>; //TODO first select a  car page

    return (
        <ScreenView>
            <ExpenseTimeline car={ selectedCar }/>
        </ScreenView>
    );
}