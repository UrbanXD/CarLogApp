import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import EditUserBottomSheet from "../../features/user/presets/bottomSheet/EditUserBottomSheet.tsx";
import { useAppSelector } from "../../hooks/index.ts";
import { getUser } from "../../features/user/model/selectors/index.ts";

const Page: React.FC = () => {
    const { type } = useLocalSearchParams();
    const user = useAppSelector(getUser);

    if(!user) router.dismiss();

    return <EditUserBottomSheet user={ user } type={ Number(type) }/>;
};

export default Page;