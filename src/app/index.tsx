import React, { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useAuth } from "../contexts/auth/AuthContext.ts";
import { useFonts } from "expo-font";
import AnimatedSplashScreen from "../screens/AnimatedSplashScreen.tsx";

SplashScreen.preventAutoHideAsync();

const App: React.FC = () => {
    const [fontsLoaded, fontsLoadError] = useFonts({
        "Gilroy-Heavy": require("../assets/fonts/Gilroy-Heavy.otf"),
        "Gilroy-Medium": require("../assets/fonts/Gilroy-Medium.ttf"),
        "Gilroy-Regular": require("../assets/fonts/Gilroy-Regular.ttf"),
        "DSEG7": require("../assets/fonts/DSEG7ClassicMini-Bold.ttf")
    });

    const { authenticated } = useAuth();

    useEffect(() => {
        if((fontsLoaded || fontsLoadError) && authenticated !== null) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontsLoadError, authenticated]);

    if(!fontsLoaded) return null;

    return (
        <AnimatedSplashScreen
            loaded={ authenticated !== null }
            redirectTo={ authenticated ? "/(main)" : "/auth" }
        />
    );
};

export default App;