import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { OdometerLogView } from "../features/car/_features/odometer/components/OdometerLogView.tsx";

export function OdometerLogScreen() {
    const { id } = useLocalSearchParams<{ id?: string }>();

    useEffect(() => {
        if(!id) {
            if(router.canGoBack()) return router.back();
            router.replace("(main)/index");
        }
    }, [id]);

    if(!id) return null;

    return <OdometerLogView id={ id }/>;
}