import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import { ReactNode } from "react";

type MeasureElementProps = {
    children: ReactNode
    onLayout: (width: number) => void
}

export function MeasureElement({ children, onLayout }: MeasureElementProps) {
    return (
        <Animated.ScrollView
            horizontal
            style={ styles.hidden }
            pointerEvents="box-none"
        >
            <View onLayout={ (event) => onLayout(event.nativeEvent.layout.width) }>
                { children }
            </View>
        </Animated.ScrollView>
    );
}

const styles = StyleSheet.create({
    hidden: {
        opacity: 0,
        zIndex: -9999
    }
});