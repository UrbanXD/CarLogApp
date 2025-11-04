import React, { useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import EditUserBottomSheet from "../../features/user/presets/bottomSheet/EditUserBottomSheet.tsx";
import { useAppSelector } from "../../hooks/index.ts";
import { getUser } from "../../features/user/model/selectors/index.ts";

const Page: React.FC = () => {
    const { type } = useLocalSearchParams();
    const user = useAppSelector(getUser);

    useEffect(() => {
        if(user) return;

        if(router.canGoBack()) return router.back();
        router.replace("backToRootIndex");
    }, [user]);

    if(!user) return <></>;

    return <EditUserBottomSheet user={ user } type={ Number(type) }/>;
};

export default Page;