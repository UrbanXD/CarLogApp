import { Edges, SafeAreaView } from "react-native-safe-area-context";
import React, { ReactNode } from "react";
import { COLORS, DEFAULT_SEPARATOR, SEPARATOR_SIZES, SIMPLE_HEADER_HEIGHT } from "../../constants";
import { ViewStyle } from "../../types";

export type ScreenViewProps = {
    screenHasHeader?: boolean
    screenHasTabBar?: boolean
    safeAreaEdges?: Edges
    style?: ViewStyle
    children?: ReactNode
}

export function ScreenView({
    screenHasHeader = true,
    safeAreaEdges,
    style,
    children
}: ScreenViewProps) {
    return (
        <SafeAreaView
            edges={ safeAreaEdges }
            style={ [
                {
                    flex: 1,
                    paddingTop: (screenHasHeader ? SIMPLE_HEADER_HEIGHT : 0) + SEPARATOR_SIZES.lightSmall,
                    paddingBottom: SEPARATOR_SIZES.lightSmall,
                    paddingHorizontal: DEFAULT_SEPARATOR,
                    backgroundColor: COLORS.black2
                },
                style
            ] }
        >
            { children }
        </SafeAreaView>
    );
}