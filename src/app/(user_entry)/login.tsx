import React from "react";
import {StatusBar} from "expo-status-bar";
import LoginScreen from "../../screens/LoginScreen";

const Page: React.FC = () => {
    return (
        <>
            <StatusBar style="light" />
            <LoginScreen />
        </>
    )
}

export default Page;