import { Stack } from 'expo-router/stack';
import {useRootNavigationState} from 'expo-router';
import React from "react";
import {ScrollViewProvider} from "../providers/ScrollViewProvider";

const Layout:React.FC = () => {
    const routerState = useRootNavigationState();
    const route: { [key: string]: any } | undefined = routerState.routes[routerState?.index || 0].params
    return (
        <ScrollViewProvider>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="fuelMonitor" />
                <Stack.Screen name="index" />
            </Stack>
        </ScrollViewProvider>
    );
}
export default Layout;