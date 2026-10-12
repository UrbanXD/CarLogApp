import React, { ReactNode } from "react";
import { Platform, StyleSheet, useWindowDimensions, View } from "react-native";
import { DEFAULT_SEPARATOR, SECONDARY_COLOR, SEPARATOR_SIZES, SIMPLE_HEADER_HEIGHT } from "../../../constants/index.ts";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SystemBars } from "react-native-edge-to-edge";

interface HeaderViewProps {
    children?: ReactNode;
}

const HeaderView: React.FC<HeaderViewProps> = ({ children }) => {
    const { top } = useSafeAreaInsets();
    const { width } = useWindowDimensions();
    const styles = useStyles(top, Platform.OS === "web" && width >= 1040);

    return (
        <View style={ styles.wrapper }>
            <SystemBars style="light" hidden={ false }/>
            <View style={ styles.barContainer }>
                { children }
            </View>
        </View>
    );
};

const useStyles = (top: number, desktop: boolean) =>
    StyleSheet.create({
        wrapper: {
            paddingTop: top,
            backgroundColor: desktop ? "transparent" : SECONDARY_COLOR,
            marginLeft: desktop ? 272 : 0,
            marginRight: desktop ? 32 : 0
        },
        barContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: SEPARATOR_SIZES.lightSmall,
            height: SIMPLE_HEADER_HEIGHT,
            width: "100%",
            maxWidth: desktop ? 1480 : Platform.OS === "web" ? 1280 : undefined,
            alignSelf: "center",
            backgroundColor: desktop ? "transparent" : SECONDARY_COLOR,
            paddingHorizontal: desktop ? 0 : DEFAULT_SEPARATOR,
            overflow: "hidden"
        }
    });

export default HeaderView;
