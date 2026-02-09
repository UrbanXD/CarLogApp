import React, { useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { OdometerLogTimeline } from "../features/car/_features/odometer/components/OdometerLogTimeline.tsx";
import { ScreenView } from "../components/screenView/ScreenView.tsx";

export function OdometerLogTimelineScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();

    useEffect(() => {
        if(id) return;

        if(router.canGoBack()) return router.back();
        router.replace("(main)/index");
    }, [id]);

    if(!id) return null;

    return (
        <ScreenView>
            <OdometerLogTimeline carId={ id }/>
        </ScreenView>
    );
}