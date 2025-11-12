import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { RideLogView } from "../../features/ride/components/RideLogView.tsx";

export function RideScreen() {
    const { id } = useLocalSearchParams();

    useEffect(() => {
        if(!id) {
            if(router.canGoBack()) return router.back();
            router.replace("(main)/index");
        }
    }, [id]);

    if(!id) return <></>;

    return <RideLogView id={ id }/>;
}