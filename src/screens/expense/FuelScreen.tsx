import { FuelLogView } from "../../features/car/_features/fuel/components/FuelLogView.tsx";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";

export function FuelScreen() {
    const { id } = useLocalSearchParams<{ id?: string }>();

    useEffect(() => {
        if(!id) {
            if(router.canGoBack()) return router.back();
            router.replace("(main)/index");
        }
    }, [id]);

    if(!id) return null;

    return <FuelLogView id={ id }/>;
}