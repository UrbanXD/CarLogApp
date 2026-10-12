import React from "react";
import { Href, Redirect } from "expo-router";

type AnimatedSplashScreenProps = {
    loaded: boolean,
    redirectTo: Href
}

const AnimatedSplashScreen: React.FC<AnimatedSplashScreenProps> = ({ redirectTo }) =>
    <Redirect href={ redirectTo }/>;

export default AnimatedSplashScreen;
