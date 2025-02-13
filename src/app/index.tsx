import React, { useEffect } from "react";
import { Redirect } from "expo-router";
import AuthScreen from "../screens/AuthScreen";
import { useSession } from "../features/Auth/context/SessionProvider.tsx";
import { useBottomSheet } from "../features/BottomSheet/context/BottomSheetContext.ts";

const App: React.FC = () => {
    const { session } = useSession();
    const { dismissAllBottomSheet } = useBottomSheet();

    useEffect(() => {
        if(session) dismissAllBottomSheet(); /// pl: becsukja az email hitelesitot
    }, [session]);

    return (
        !(session && session.user)
            ?   <AuthScreen />
            :   <Redirect href="/(main)" />
    )
}

export default App;