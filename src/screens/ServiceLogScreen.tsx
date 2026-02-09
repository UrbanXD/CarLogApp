import React from "react";
import { ServiceLogTimeline } from "../features/expense/_features/service/components/ServiceLogTimeline.tsx";
import { FirstSelectCar } from "../components/firstSelectCar/FirstSelectCar.tsx";
import { useSelectedCarId } from "../features/car/hooks/useSelectedCarId.ts";
import { ScreenView } from "../components/screenView/ScreenView.tsx";

export function ServiceLogScreen() {
    const { selectedCarId } = useSelectedCarId();

    if(!selectedCarId) return <FirstSelectCar/>;

    return (
        <ScreenView>
            <ServiceLogTimeline carId={ selectedCarId }/>
        </ScreenView>

    );
}