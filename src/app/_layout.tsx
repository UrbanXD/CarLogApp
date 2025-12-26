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
import { DatabaseProvider } from "../contexts/database/DatabaseProvider.tsx";
import { store } from "../database/redux/store.ts";
import Header from "../components/Navigation/Header/Header.tsx";
import ToastManager from "../ui/alert/components/toast/ToastManager.tsx";
import ModalManager from "../ui/alert/components/modal/ModalManager.tsx";
import { SystemBars } from "react-native-edge-to-edge";
import { SECONDARY_COLOR } from "../constants/index.ts";
import { PortalHost, PortalProvider } from "@gorhom/portal";
import { useTranslation } from "react-i18next";
import { setBackgroundColorAsync } from "expo-system-ui";


const Layout: React.FC = () => {
    const { t } = useTranslation();

    useEffect(() => {
        (async () => {
            await setBackgroundColorAsync(SECONDARY_COLOR);
        })();
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
                    header: () => <Header.Secondary title={ t("profile.title") }/>
                } }
            />
            <Stack.Screen
                name="(edit)/car"
                options={ {
                    header: () => <Header.Secondary title={ t("car.title") }/>
                } }
            />
            <Stack.Screen
                name="user/resetPassword"
                options={ {
                    header: () => <></>,
                    animation: "slide_from_bottom",
                    presentation: "transparentModal",
                    contentStyle: { backgroundColor: "transparent" }
                } }
            />
            <Stack.Screen
                name="car/create"
                options={ {
                    header: () => <></>,
                    animation: "slide_from_bottom",
                    presentation: "transparentModal",
                    contentStyle: { backgroundColor: "transparent" }
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
                    header: () => <Header.Secondary title={ t("odometer.title") }/>
                } }
            />
            <Stack.Screen
                name="odometer/log/[id]"
                options={ {
                    header: () => <Header.Secondary title={ t("common.log_title") }/>
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
                    header: () => <Header.Secondary title={ t("expenses.title_singular") }/>
                } }
            />
            <Stack.Screen
                name="expense/fuel/[id]"
                options={ ({ route }) => ({
                    header: () => <Header.Secondary title={ route.params?.title ?? t("log.title") }/>
                }) }
            />
            <Stack.Screen
                name="expense/service/[id]"
                options={ ({ route }) => ({
                    header: () => <Header.Secondary title={ route.params?.title ?? t("log.title") }/>
                }) }
            />
            <Stack.Screen
                name="expense/create/index"
                options={ {
                    header: () => <></>,
                    animation: "slide_from_bottom",
                    presentation: "transparentModal",
                    contentStyle: { backgroundColor: "transparent" }
                } }
            />
            <Stack.Screen
                name="expense/create/fuel"
                options={ {
                    header: () => <></>,
                    animation: "slide_from_bottom",
                    presentation: "transparentModal",
                    contentStyle: { backgroundColor: "transparent" }
                } }
            />
            <Stack.Screen
                name="expense/create/service"
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
            <Stack.Screen
                name="expense/edit/fuel/[id]"
                options={ {
                    header: () => <></>,
                    animation: "slide_from_bottom",
                    presentation: "transparentModal",
                    contentStyle: { backgroundColor: "transparent" }
                } }
            />
            <Stack.Screen
                name="expense/edit/service/[id]"
                options={ {
                    header: () => <></>,
                    animation: "slide_from_bottom",
                    presentation: "transparentModal",
                    contentStyle: { backgroundColor: "transparent" }
                } }
            />
            <Stack.Screen
                name="ride/place/index"
                options={ {
                    header: () => <Header.Secondary title={ t("places.title") }/>
                } }
            />
            <Stack.Screen
                name="ride/place/create"
                options={ {
                    header: () => <></>,
                    animation: "slide_from_bottom",
                    presentation: "transparentModal",
                    contentStyle: { backgroundColor: "transparent" }
                } }
            />
            <Stack.Screen
                name="ride/place/edit/[id]"
                options={ {
                    header: () => <></>,
                    animation: "slide_from_bottom",
                    presentation: "transparentModal",
                    contentStyle: { backgroundColor: "transparent" }
                } }
            />
            <Stack.Screen
                name="ride/passenger/index"
                options={ {
                    header: () => <Header.Secondary title={ t("passengers.title") }/>
                } }
            />
            <Stack.Screen
                name="ride/passenger/create"
                options={ {
                    header: () => <></>,
                    animation: "slide_from_bottom",
                    presentation: "transparentModal",
                    contentStyle: { backgroundColor: "transparent" }
                } }
            />
            <Stack.Screen
                name="ride/passenger/edit/[id]"
                options={ {
                    header: () => <></>,
                    animation: "slide_from_bottom",
                    presentation: "transparentModal",
                    contentStyle: { backgroundColor: "transparent" }
                } }
            />
            <Stack.Screen
                name="ride/create"
                options={ {
                    header: () => <></>,
                    animation: "slide_from_bottom",
                    presentation: "transparentModal",
                    contentStyle: { backgroundColor: "transparent" }
                } }
            />
            <Stack.Screen
                name="ride/edit/[id]"
                options={ {
                    header: () => <></>,
                    animation: "slide_from_bottom",
                    presentation: "transparentModal",
                    contentStyle: { backgroundColor: "transparent" }
                } }
            />
            <Stack.Screen
                name="ride/[id]"
                options={ {
                    header: () => <Header.Secondary title={ t("rides.log") }/>
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