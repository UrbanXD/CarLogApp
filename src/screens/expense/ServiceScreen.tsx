import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { ServiceLogView } from "../../features/expense/_features/service/components/ServiceLogView.tsx";

export function ServiceScreen() {
    const { id } = useLocalSearchParams<{ id?: string }>();

    useEffect(() => {
        if(!id) {
            if(router.canGoBack()) return router.back();
            router.replace("(main)/index");
        }
    }, [id]);

    if(!id) return null;

    return <ServiceLogView id={ id }/>;
}