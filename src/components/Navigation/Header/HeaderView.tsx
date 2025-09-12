import React, { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { DEFAULT_SEPARATOR, SECONDARY_COLOR, SEPARATOR_SIZES, SIMPLE_HEADER_HEIGHT } from "../../../constants/index.ts";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SystemBars } from "react-native-edge-to-edge";

interface HeaderViewProps {
    children?: ReactNode;
}

const HeaderView: React.FC<HeaderViewProps> = ({ children }) => {
    const { top } = useSafeAreaInsets();
    const styles = useStyles(top);

    return (
        <View style={ styles.wrapper }>
            <SystemBars style="light" hidden={ false }/>
            <View style={ styles.barContainer }>
                { children }
            </View>
        </View>
    );
};

const useStyles = (top: number) =>
    StyleSheet.create({
        wrapper: {
            paddingTop: top
        },
        barContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: SEPARATOR_SIZES.lightSmall,
            height: SIMPLE_HEADER_HEIGHT,
            backgroundColor: SECONDARY_COLOR,
            paddingHorizontal: DEFAULT_SEPARATOR,
            overflow: "hidden"
        }
    });

export default HeaderView;