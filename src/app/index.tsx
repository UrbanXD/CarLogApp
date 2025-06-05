import React, { useEffect } from "react";
import { Redirect } from "expo-router";
import AuthScreen from "../screens/AuthScreen";
import { useBottomSheet } from "../features/BottomSheet/context/BottomSheetContext.ts";
import { useAuth } from "../contexts/Auth/AuthContext.ts";
import {View} from "react-native";

const App: React.FC = () => {
    const { session, isSessionLoading } = useAuth();
    const { dismissAllBottomSheet } = useBottomSheet();

    useEffect(() => {
        if(session) dismissAllBottomSheet(); /// pl: becsukja az email hitelesitot
    }, [session]);

    return (
        isSessionLoading
            ?   <View style={{ flex:1, backgroundColor: 'black' }} /> /// skeleton komponens utan kivaltasra kerul
            :   !(session && session.user)
                    ?   <AuthScreen />
                    :   <Redirect href="/(main)" />
    )
}

export default App;