import React, { useEffect, useMemo } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { OdometerLogTimeline } from "../features/car/_features/odometer/components/OdometerLogTimeline.tsx";
import { ScreenView } from "../components/screenView/ScreenView.tsx";
import useCars from "../features/car/hooks/useCars.ts";

export function OdometerLogTimelineScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { getCar } = useCars();

    const car = useMemo(() => getCar(id), [id, getCar]);

    useEffect(() => {
        if(id) return;

        if(router.canGoBack()) return router.back();
        router.replace("(main)/index");
    }, [id]);

    if(!car) return null;

    return (
        <ScreenView>
            <OdometerLogTimeline car={ car }/>
        </ScreenView>
    );
}