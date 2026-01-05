import { ScrollView } from "react-native-gesture-handler";
import { ReactNode } from "react";
import { SEPARATOR_SIZES } from "../../constants/index.ts";
import { StyleSheet, ViewStyle } from "react-native";

type TimelineFilterRowProps = {
    children: ReactNode
    style?: ViewStyle
}

export function FilterRow({ children, style }: TimelineFilterRowProps) {
    return (
        <ScrollView
            contentContainerStyle={ [styles.container, style] }
            horizontal
            showsHorizontalScrollIndicator={ false }
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