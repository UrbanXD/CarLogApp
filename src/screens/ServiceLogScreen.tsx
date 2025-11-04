import React from "react";
import { ScreenScrollView } from "../components/screenView/ScreenScrollView.tsx";
import { ServiceLogTimeline } from "../features/expense/_features/service/components/ServiceLogTimeline.tsx";
import useCars from "../features/car/hooks/useCars.ts";

export function ServiceLogScreen() {
    const { selectedCar } = useCars();

    if(!selectedCar) return <></>;

    return (
        <ScreenScrollView>
            <ServiceLogTimeline car={ selectedCar }/>
        </ScreenScrollView>

    );
}