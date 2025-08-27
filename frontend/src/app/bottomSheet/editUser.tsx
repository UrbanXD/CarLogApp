import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useAuth } from "../../contexts/auth/AuthContext.ts";
import EditUserBottomSheet from "../../features/user/presets/bottomSheet/EditUserBottomSheet.tsx";

const Page: React.FC = () => {
    const { stepIndex, passwordReset } = useLocalSearchParams();
    const { user } = useAuth();

    if(!user) router.dismiss();

    return (
        <EditUserBottomSheet user={ user } stepIndex={ Number(stepIndex) } passwordReset={ passwordReset }/>
    );
};

export default Page;