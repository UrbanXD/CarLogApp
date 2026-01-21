import React, { useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import EditUserBottomSheet from "../../features/user/presets/bottomSheet/EditUserBottomSheet.tsx";
import { useUser } from "../../features/user/hooks/useUser.ts";

const Page: React.FC = () => {
    const { type } = useLocalSearchParams();
    const { user, isLoading } = useUser();

    useEffect(() => {
        if(user || isLoading) return;

        if(router.canGoBack()) return router.back();
        router.replace("backToRootIndex");
    }, [user, isLoading]);

    if(!user) return <></>;

    return <EditUserBottomSheet user={ user } type={ Number(type) }/>;
};

export default Page;