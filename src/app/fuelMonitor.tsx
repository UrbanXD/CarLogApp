import React from "react";
import FuelMonitorScreen from "../screens/FuelMonitorScreen";
import {StatusBar} from "expo-status-bar";

const Page: React.FC = () => {
    return (
        <>
            <StatusBar style="dark" />
            <FuelMonitorScreen />
        </>
    )
}

export default Page;