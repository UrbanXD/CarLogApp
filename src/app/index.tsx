import React, { useEffect } from "react";
import { Redirect } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import AuthScreen from "../screens/AuthScreen";
import { useBottomSheet } from "../ui/bottomSheet/contexts/BottomSheetContext.ts";
import { useAuth } from "../contexts/Auth/AuthContext.ts";
import { useFonts } from "expo-font";

SplashScreen.preventAutoHideAsync();

const App: React.FC = () => {
    const [fontsLoaded, fontsLoadError] = useFonts({
        "Gilroy-Heavy": require("../assets/fonts/Gilroy-Heavy.otf"),
        "Gilroy-Medium": require("../assets/fonts/Gilroy-Medium.ttf"),
        "Gilroy-Regular": require("../assets/fonts/Gilroy-Regular.ttf"),
        "DSEG7": require("../assets/fonts/DSEG7ClassicMini-Bold.ttf")
    });

    const { session, sessionLoading } = useAuth();
    const { dismissAllBottomSheet } = useBottomSheet();


    useEffect(() => {
        if(fontsLoaded && !sessionLoading || fontsLoadError) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontsLoadError, sessionLoading]);

    useEffect(() => {
        if(session) dismissAllBottomSheet();
    }, [session]);

    return (
        !(session && session.user)
        ? <AuthScreen/>
        : <Redirect href="/(main)"/>
    );
};

export default App;