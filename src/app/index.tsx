import React, { useEffect } from "react";
import { Redirect } from "expo-router";
import AuthScreen from "../screens/AuthScreen";
import { useBottomSheet } from "../features/BottomSheet/context/BottomSheetContext.ts";
import { useAuth } from "../contexts/Auth/AuthContext.ts";

const App: React.FC = () => {
    const { session } = useAuth();
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