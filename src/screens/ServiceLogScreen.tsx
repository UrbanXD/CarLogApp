import React from "react";
import { ScreenScrollView } from "../components/screenView/ScreenScrollView.tsx";
import { ServiceLogTimeline } from "../features/expense/_features/service/components/ServiceLogTimeline.tsx";
import { FirstSelectCar } from "../components/firstSelectCar/FirstSelectCar.tsx";
import { useSelectedCarId } from "../features/car/hooks/useSelectedCarId.ts";

export function ServiceLogScreen() {
    const { selectedCarId } = useSelectedCarId();

    if(!selectedCarId) return <FirstSelectCar/>;

    return (
        <ScreenScrollView>
            <ServiceLogTimeline carId={ selectedCarId }/>
        </ScreenScrollView>

    );
}