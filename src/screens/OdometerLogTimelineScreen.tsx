import React, { useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, DEFAULT_SEPARATOR, SEPARATOR_SIZES, SIMPLE_HEADER_HEIGHT } from "../constants/index.ts";
import { OdometerLogTimeline } from "../features/car/components/odometer/OdometerLogTimeline.tsx";

export function OdometerLogTimelineScreen() {
    const { id } = useLocalSearchParams();

    useEffect(() => {
        if(id) return;

        if(router.canGoBack()) return router.back();
        router.replace("(main)/index");
    }, [id]);

    if(!id) return <></>;

    return (
        <SafeAreaView
            style={ {
                flex: 1,
                paddingTop: SIMPLE_HEADER_HEIGHT + SEPARATOR_SIZES.lightSmall,
                paddingHorizontal: DEFAULT_SEPARATOR,
                paddingBottom: SEPARATOR_SIZES.lightSmall,
                backgroundColor: COLORS.black2
            } }
        >
            <OdometerLogTimeline carId={ id }/>
        </SafeAreaView>
    );
}