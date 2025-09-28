import { ScrollView } from "react-native-gesture-handler";
import { ReactNode } from "react";
import { COLORS, DEFAULT_SEPARATOR, SEPARATOR_SIZES } from "../../constants/index.ts";
import { StyleSheet } from "react-native";

type TimelineFilterRowProps = {
    children: ReactNode
}

export function FilterRow({ children }: TimelineFilterRowProps) {
    return (
        <ScrollView contentContainerStyle={ styles.container } horizontal>
            { children }
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: "center",
        alignSelf: "flex-start",
        backgroundColor: COLORS.black2,
        gap: SEPARATOR_SIZES.lightSmall,
        paddingHorizontal: DEFAULT_SEPARATOR,
        paddingVertical: SEPARATOR_SIZES.lightSmall / 2
    }
});