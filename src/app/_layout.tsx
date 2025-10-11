import { Stack } from "expo-router/stack";
import React, { useEffect } from "react";
import "@azure/core-asynciterator-polyfill";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Provider } from "react-redux";
import { KeyboardProvider } from "react-native-keyboard-controller";
import Compactor from "../components/Compactor";
import { ScreenScrollViewProvider } from "../contexts/screenScrollView/ScreenScrollViewProvider.tsx";
import { AuthProvider } from "../contexts/auth/AuthProvider.tsx";
import { useDatabase } from "../contexts/database/DatabaseContext.ts";
import { DatabaseProvider } from "../contexts/database/DatabaseProvider.tsx";
import { store } from "../database/redux/store.ts";
import Header from "../components/Navigation/Header/Header.tsx";
import ToastManager from "../ui/alert/components/toast/ToastManager.tsx";
import ModalManager from "../ui/alert/components/modal/ModalManager.tsx";
import * as SystemUI from "expo-system-ui";
import { SystemBars } from "react-native-edge-to-edge";
import { SECONDARY_COLOR } from "../constants/index.ts";
import { PortalHost, PortalProvider } from "@gorhom/portal";


const Layout: React.FC = () => {
    const database = useDatabase();

    useEffect(() => {
        SystemUI.setBackgroundColorAsync(SECONDARY_COLOR);
        database.init();
    }, []);

    return (
        <Stack
            screenOptions={ {
                header: () => <SystemBars style="light" hidden={ false }/>,
                headerTransparent: true,
                animation: "slide_from_right",
                statusBarAnimation: "slide",
                contentStyle: { backgroundColor: SECONDARY_COLOR }
            } }
        >
            <Stack.Screen name="index"/>
            <Stack.Screen name="backToRootIndex"/>
            <Stack.Screen
                name="auth"
                options={ {
                    header: () => <SystemBars style={ { statusBar: "dark", navigationBar: "light" } }/>,
                    animation: "none"
                } }
            />
            <Stack.Screen
                name="bottomSheet/createCar"
                options={ {
                    header: () => <></>,
                    animation: "slide_from_bottom",
                    presentation: "transparentModal",
                    contentStyle: { backgroundColor: "transparent" }
                } }
            />
            <Stack.Screen
                name="bottomSheet/signIn"
                options={ {
                    header: () => <></>,
                    animation: "slide_from_bottom",
                    presentation: "transparentModal",
                    contentStyle: { backgroundColor: "transparent" }
                } }
            />
            <Stack.Screen
                name="bottomSheet/signUp"
                options={ {
                    header: () => <></>,
                    animation: "slide_from_bottom",
                    presentation: "transparentModal",
                    contentStyle: { backgroundColor: "transparent" }
                } }
            />
            <Stack.Screen
                name="bottomSheet/otpVerification"
                options={ {
                    header: () => <></>,
                    animation: "slide_from_bottom",
                    presentation: "transparentModal",
                    contentStyle: { backgroundColor: "transparent" }
                } }
            />
            <Stack.Screen
                name="bottomSheet/editUser"
                options={ {
                    header: () => <></>,
                    animation: "slide_from_bottom",
                    presentation: "transparentModal",
                    contentStyle: { backgroundColor: "transparent" }
                } }
            />
            <Stack.Screen
                name="(main)"
                options={ {
                    header: () => <Header.Primary/>,
                    animation: "none"
                } }
            />
            <Stack.Screen
                name="(profile)/user"
                options={ {
                    header: () => <Header.Secondary title="Profil"/>
                } }
            />
            <Stack.Screen
                name="(edit)/car"
                options={ {
                    header: () => <Header.Secondary title="Autó adatlap"/>
                } }
            />
            <Stack.Screen
                name="car/edit/[id]"
                options={ {
                    header: () => <></>,
                    animation: "slide_from_bottom",
                    presentation: "transparentModal",
                    contentStyle: { backgroundColor: "transparent" }
                } }
            />
            <Stack.Screen
                name="odometer/log"
                options={ {
                    header: () => <Header.Secondary title="Kilométeróra-állás napló"/>
                } }
            />
            <Stack.Screen
                name="odometer/log/[id]"
                options={ {
                    header: () => <Header.Secondary title="Napló bejegyzés"/>
                } }
            />
            <Stack.Screen
                name="odometer/log/create"
                options={ {
                    header: () => <></>,
                    animation: "slide_from_bottom",
                    presentation: "transparentModal",
                    contentStyle: { backgroundColor: "transparent" }
                } }
            />
            <Stack.Screen
                name="odometer/log/edit/[id]"
                options={ {
                    header: () => <></>,
                    animation: "slide_from_bottom",
                    presentation: "transparentModal",
                    contentStyle: { backgroundColor: "transparent" }
                } }
            />
            <Stack.Screen
                name="expense/[id]"
                options={ {
                    header: () => <Header.Secondary title="Kiadás"/>
                } }
            />
            <Stack.Screen
                name="expense/create"
                options={ {
                    header: () => <></>,
                    animation: "slide_from_bottom",
                    presentation: "transparentModal",
                    contentStyle: { backgroundColor: "transparent" }
                } }
            />
            <Stack.Screen
                name="expense/edit/[id]"
                options={ {
                    header: () => <></>,
                    animation: "slide_from_bottom",
                    presentation: "transparentModal",
                    contentStyle: { backgroundColor: "transparent" }
                } }
            />
        </Stack>
    );
};

const RootLayout: React.FC = () =>
    <DatabaseProvider>
        <Compactor components={ [
            { Component: Provider, props: { store } },
            { Component: SafeAreaProvider },
            { Component: KeyboardProvider },
            { Component: ScreenScrollViewProvider },
            { Component: GestureHandlerRootView, props: { style: { flex: 1 } } },
            { Component: PortalProvider },
            { Component: AuthProvider },
            { Component: ToastManager },
            { Component: ModalManager },
            { Component: BottomSheetModalProvider }
        ] }>
            <PortalHost name="popup"/>
            <Layout/>
        </Compactor>
    </DatabaseProvider>;

export default RootLayout;