import { ScrollView } from "react-native-gesture-handler";
import { useDesktopWeb } from "../../hooks/useDesktopWeb";
import { ReactNode } from "react";
import { SEPARATOR_SIZES } from "../../constants/index.ts";
import { StyleSheet } from "react-native";
import { ViewStyle } from "../../types/index.ts";
import { WEB_SCROLLBAR_STYLE } from "../screenView/webScrollbarStyle";

type TimelineFilterRowProps = {
    children: ReactNode
    style?: ViewStyle
}

export function FilterRow({ children, style }: TimelineFilterRowProps) {
    const showWebScrollbar = useDesktopWeb();
    return (
        <ScrollView
            style={ showWebScrollbar ? WEB_SCROLLBAR_STYLE : undefined }
            contentContainerStyle={ [styles.container, style] }
            horizontal
            showsHorizontalScrollIndicator={ showWebScrollbar }
        >
            { children }
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: "center",
        alignSelf: "flex-start",
        gap: SEPARATOR_SIZES.lightSmall,
        marginBottom: SEPARATOR_SIZES.lightSmall
    }
});
