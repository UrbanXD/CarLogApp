import { Edges, SafeAreaView } from "react-native-safe-area-context";
import React, { ReactNode } from "react";
import { Platform, useWindowDimensions, View } from "react-native";
import { COLORS, DEFAULT_SEPARATOR, SEPARATOR_SIZES, SIMPLE_HEADER_HEIGHT } from "../../constants";
import { ViewStyle } from "../../types";
import { usePathname } from "expo-router";

export type ScreenViewProps = {
    screenHasHeader?: boolean
    screenHasTabBar?: boolean
    fullWidthScrollArea?: boolean
    safeAreaEdges?: Edges
    style?: ViewStyle
    children?: ReactNode
}

export function ScreenView({
    screenHasHeader = true,
    safeAreaEdges,
    fullWidthScrollArea = false,
    style,
    children
}: ScreenViewProps) {
    const { width } = useWindowDimensions();
    const pathname = usePathname();
    const desktop = Platform.OS === "web" && width >= 1040 && !pathname.startsWith("/auth");
    const desktopMainPage = desktop && (
        pathname === "/" ||
        ["/workbook", "/service_log", "/expenses", "/statistics"].includes(pathname)
    );
    const edgeToEdgeScrollArea = desktop && fullWidthScrollArea;

    return (
        <SafeAreaView
            edges={ safeAreaEdges }
            style={ [
                {
                    flex: 1,
                    paddingTop: desktop
                                ? (desktopMainPage
                                   ? SEPARATOR_SIZES.medium
                                   : SIMPLE_HEADER_HEIGHT) + SEPARATOR_SIZES.lightSmall
                                : (screenHasHeader ? SIMPLE_HEADER_HEIGHT : 0) + SEPARATOR_SIZES.lightSmall,
                    paddingBottom: SEPARATOR_SIZES.lightSmall,
                    paddingHorizontal: desktop ? 32 : DEFAULT_SEPARATOR,
                    backgroundColor: COLORS.black2
                },
                style,
                desktop && { paddingLeft: 272, paddingRight: edgeToEdgeScrollArea ? 0 : 32 }
            ] }
        >
            <View style={ {
                flex: 1,
                width: "100%",
                maxWidth: Platform.OS === "web" && !edgeToEdgeScrollArea ? 1480 : undefined,
                alignSelf: "center"
            } }>
                { children }
            </View>
        </SafeAreaView>
    );
}
