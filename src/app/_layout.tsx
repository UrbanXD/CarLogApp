import { Stack } from 'expo-router/stack';
import {SplashScreen, useRootNavigationState} from 'expo-router';
import React, {useEffect, useState} from "react";
import {headerFontSizes, headerIconColors, headerStyles} from "../styles/headers.style";
import HeaderTitle from "../components/header/HeaderTitle";
import HeaderBackButton from "../components/header/HeaderBackButton";
import HeaderButtonMenu from "../components/header/HeaderButtonMenu";
import CustomHeader from "../components/header/CustomHeader";
import {theme} from "../styles/theme";
import {View, Text} from "react-native";
import HeaderImage from "../components/header/HeaderImage";
import HeaderBar from "../components/header/HeaderBar";
import {ScrollViewProvider, useScrollView} from "../providers/ScrollViewProvider";
import {useAnimatedReaction, useSharedValue} from "react-native-reanimated";
import {useFonts} from "expo-font";

SplashScreen.preventAutoHideAsync();

const Layout:React.FC = () => {
    const routerState = useRootNavigationState();
    const route: { [key: string]: any } | undefined = routerState.routes[routerState?.index || 0].params

    const [loaded, error] = useFonts({
        // Gilroy: require("../assets/fonts/Gilroy-Heavy.otf"),
        // Nosifer: require("../assets/fonts/Nosifer-Regular.ttf"),
        // DoubleFeature20: require("../assets/fonts/DoubleFeature20.ttf")
    });

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }

    return (
        <ScrollViewProvider>
            <Stack
                screenOptions={{
                    // headerStyle: headerStyles.simpleStyle,
                    headerTitleStyle: headerStyles.titleStyle,
                    headerShown: true,
                    headerBackVisible: false,
                }}
            >
                <Stack.Screen
                    name="(competitions)"
                    options={{
                        header: () => (
                            <CompetitionHeader />
                        )
                    }}
                />
                <Stack.Screen
                    name="fuelMonitor"
                    options={{
                        header: () => ( <></> )
                    }}
                />
                <Stack.Screen
                    name="index"
                    options={{
                        header: () =>
                            <CustomHeader statusbarColor={ theme.colors.primaryBackground2 } backgroundColor="transparent">
                                <HeaderButtonMenu
                                    icons={[
                                        {
                                            icon: "cog",
                                            size: headerFontSizes.icon,
                                            iconColor: headerIconColors.light,
                                            style: {
                                                alignSelf: "flex-end"
                                            },
                                            onPress: () => alert("CsaOG")
                                        }
                                    ]}
                                />
                            </CustomHeader>
                    }}
                />
            </Stack>
        </ScrollViewProvider>
    );
}
export default Layout;

const CompetitionHeader: React.FC = () => {
    const { lastContentOffset} = useScrollView();

    const headerHeight = useSharedValue(180);
    const imageHeight = useSharedValue(110);
    useAnimatedReaction(
        () => lastContentOffset.value,
        (latestValue: number) => {
            console.log(latestValue)
            headerHeight.value = latestValue > 110 ? 180 - 110 : 180 - latestValue
            imageHeight.value = latestValue > 110 ? 0 : 110 - latestValue
        }
    );

    return (
        <CustomHeader
            backgroundColor={ theme.colors.primaryBackground1 }
            height={ headerHeight }
        >
            <HeaderImage
                image={ require("../assets/bg2.jpg") }
                height={ imageHeight }
            />
            <HeaderBar
                backgroundColor={ theme.colors.primaryBackground1 }
                height={ 70 }
            >
                <HeaderBackButton />
                <View
                    style={{
                        flexDirection: "column"
                    }}
                >
                    <HeaderTitle
                        title="Nemzeti Bajnoksag II"
                        titleStyle={ headerStyles.titleStyle }
                        image={ require("../assets/nb2.png") }
                    />
                    <Text style={{color: "blue"}}>xd</Text>
                </View>
                <HeaderButtonMenu
                    icons={[
                        {
                            icon: "cog",
                            size: headerFontSizes.icon,
                            iconColor: headerIconColors.light,
                            style: {
                                alignSelf: "flex-end"
                            },
                            onPress: () => alert("CsaOG")
                        }
                    ]}
                />
            </HeaderBar>
        </CustomHeader>
    )
}