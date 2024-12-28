import React, {ReactElement, ReactNode} from "react";
import {StyleSheet, Text, View} from "react-native";
import {BottomSheetView} from "@gorhom/bottom-sheet";
import {FONT_SIZES, GLOBAL_STYLE, SEPARATOR_SIZES} from "../../core/constants/constants";
import {useSafeAreaInsets} from "react-native-safe-area-context";

interface BottomSheetContainerProps {
    title: string
    renderCloseButton?: () => ReactNode
    children: ReactNode
}

const BottomSheetContainer: React.FC<BottomSheetContainerProps> = ({
    title,
    renderCloseButton,
    children
}) => {
    const { top } = useSafeAreaInsets();
    const styles = useStyles(top);

    return (
        <>
            <View style={ styles.titleContainer }>
                { renderCloseButton && renderCloseButton() }
                <Text style={ styles.titleText }>
                    { title }
                </Text>
            </View>
            <BottomSheetView style={ styles.contentContainer }>
                { children }
            </BottomSheetView>
        </>
    );
}

const useStyles = (top: number) =>
    StyleSheet.create({
        titleContainer:{
            paddingTop: top / 2
        },
        titleText: {
            ...GLOBAL_STYLE.containerTitleText,
            fontSize: FONT_SIZES.medium,
            textAlign: "center"
        },
        contentContainer: {
            flex: 1,
            paddingHorizontal: SEPARATOR_SIZES.medium
        }
    })

export default BottomSheetContainer;