import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS, FONT_SIZES, ICON_NAMES, SEPARATOR_SIZES } from "../constants";
import Icon from "./Icon";
import { hexToRgba } from "../utils/colors/hexToRgba";
import { ImageSource, ViewStyle } from "../types";
import { MoreDataLoading } from "./loading/MoreDataLoading.tsx";
import { DebouncedPressable } from "./DebouncedPressable.tsx";

type DefaultElementProps = {
    icon?: ImageSource
    text?: string
    onPress?: () => void
    loading?: boolean
    loadingText?: string
    activityIndicatorSize?: "large" | "small" | number
    style?: ViewStyle
}

function DefaultElement({
    icon = ICON_NAMES.image,
    text,
    onPress,
    loading,
    loadingText,
    activityIndicatorSize = "large",
    style
}: DefaultElementProps) {
    const onPressHandler = useMemo(() => () => {
        if(loading) return;

        onPress?.();
    }, [onPress, loading]);

    return (
        <DebouncedPressable
            onPress={ onPressHandler }
            disabled={ !onPress || loading }
            style={ [styles.container, style] }
        >
            <View style={ { alignItems: "center" } }>
                {
                    loading
                    ?
                    <MoreDataLoading
                        text={ loadingText }
                        activityIndicatorSize={ activityIndicatorSize }
                    />
                    :
                    <>
                        <Icon
                            icon={ icon }
                            size={ FONT_SIZES.title }
                            color={ COLORS.gray3 }
                        />
                        {
                            text &&
                           <Text style={ styles.text }>{ text }</Text>
                        }
                    </>
                }
            </View>
        </DebouncedPressable>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        flexDirection: "column",
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: hexToRgba(COLORS.gray5, 0.65),
        borderWidth: 0.5,
        borderRadius: 38,
        borderColor: COLORS.gray5,
        paddingHorizontal: SEPARATOR_SIZES.small,
        overflow: "hidden"
    },
    text: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p2,
        letterSpacing: FONT_SIZES.p2 * 0.025,
        lineHeight: FONT_SIZES.p2 * 1.25,
        color: COLORS.gray2,
        textAlign: "center"
    }
});

export default DefaultElement;