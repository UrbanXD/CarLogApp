import React, { ReactNode } from "react";
import { ActivityIndicator, Image as ImageRN, ImageStyle, StyleSheet, View } from "react-native";
import DefaultElement from "./DefaultElement";
import { COLORS, ICON_NAMES } from "../constants/index.ts";
import { hexToRgba } from "../utils/colors/hexToRgba";
import { LinearGradient } from "expo-linear-gradient";
import { useFile } from "../database/hooks/useFile.ts";

type ImageProps = {
    path?: string
    alt?: string
    imageStyle?: ImageStyle
    overlay?: boolean
    attachment?: boolean
    children?: ReactNode
}

function Image({
    path,
    alt = ICON_NAMES.image,
    imageStyle,
    overlay = true,
    attachment = true,
    children
}: ImageProps) {
    const { source, loading, error } = useFile({ uri: path, attachment: attachment });

    return (
        <>
            {
                loading
                ?
                <View
                    style={ [styles.image, imageStyle, { backgroundColor: COLORS.black5, justifyContent: "center" }] }>
                    <ActivityIndicator size="large" color={ COLORS.gray2 }/>
                </View>
                : error || !source
                  ? <DefaultElement icon={ alt } style={ [styles.image, imageStyle] }/>
                  : <ImageRN source={ { uri: source } } style={ [styles.image, imageStyle] }/>
            }
            {
                children &&
               <View style={ [styles.contentContainer, imageStyle] }>
                   {
                       overlay &&
                      <LinearGradient
                         locations={ [0, 0.85] }
                         colors={ [hexToRgba(COLORS.black, 0.15), hexToRgba(COLORS.black, 0.60)] }
                         style={ [
                             styles.imageOverlay,
                             imageStyle?.borderRadius && { borderRadius: imageStyle.borderRadius }
                         ] }
                      />
                   }
                   { children }
               </View>
            }
        </>
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        width: "100%"
    },
    image: {
        position: "absolute",
        width: "100%",
        height: "100%",
        resizeMode: "stretch",
        borderRadius: 35,
        borderWidth: 1.5,
        borderColor: COLORS.gray4
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 33
    }
});

export default React.memo(Image);