import React, { ReactNode, useEffect, useState } from "react";
import { Image as ImageRN, ImageSourcePropType, ImageStyle, StyleSheet, View } from "react-native";
import DefaultElement from "./DefaultElement";
import { COLORS, ICON_NAMES } from "../constants/index.ts";
import { hexToRgba } from "../utils/colors/hexToRgba";
import { LinearGradient } from "expo-linear-gradient";
import { ImageSource } from "../types/index.ts";

type ImageProps = {
    source?: ImageSource
    alt?: string
    mimeType?: string
    imageStyle?: ImageStyle
    overlay?: boolean
    children?: ReactNode
}

function Image({
    source,
    alt = ICON_NAMES.image,
    mimeType = "image/jpeg",
    imageStyle,
    overlay = true,
    children
}: ImageProps) {
    const [imageError, setImageError] = useState<boolean>(!source);

    const handleImageLoadError = () => setImageError(true);
    const handleImageLoaded = () => setImageError(false);

    useEffect(() => {
        setImageError(!source);
    }, [source]);

    const formatImageSource =
        (source: ImageSourcePropType | string = "") =>
            typeof source === "string"
            ? { uri: `data:${ mimeType };base64,${ source }` }
            : source;

    return (
        <>
            {
                !imageError
                ? <ImageRN
                    source={ formatImageSource(source) }
                    onError={ handleImageLoadError }
                    onLoad={ handleImageLoaded }
                    style={ [styles.image, imageStyle] }
                />
                : <DefaultElement
                    icon={ alt }
                    style={ [styles.image, imageStyle] }
                />
            }
            {
                children &&
               <View style={ [styles.contentContainer, imageStyle] }>
                   {
                       overlay && !imageError &&
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
};

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1
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

export default Image;