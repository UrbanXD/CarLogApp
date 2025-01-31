import React, {useEffect, useState} from "react";
import {ImageSourcePropType, Image as ImageRN, StyleProp, View, ViewStyle, StyleSheet, ImageStyle} from "react-native";
import DefaultElement from "./DefaultElement";
import {ICON_NAMES} from "../constants/constants";
import {theme} from "../constants/theme";
import {hexToRgba} from "../utils/colors/hexToRgba";
import {LinearGradient} from "expo-linear-gradient";

interface ImageProps {
    source?: ImageSourcePropType | string
    alt?: string
    imageStyle?: StyleProp<ImageStyle>
    overlay?: boolean
    children?: React.ReactNode
}

const Image: React.FC<ImageProps> = ({
    source,
    alt = ICON_NAMES.image,
    imageStyle,
    overlay= true,
    children
}) => {
    const [imageError, setImageError] = useState<boolean>(!source);

    const handleImageLoadError = () => setImageError(true);
    const handleImageLoaded = () => setImageError(false);

    const styles = useStyles(imageStyle);

    useEffect(() => {
        setImageError(!source);
    }, [source]);

    const formatImageSource =
        (source: ImageSourcePropType | string = "") =>
            typeof source === "string"
                ? { uri: `data:image/jpeg;base64,${source}` }
                : source

    return (
        <>
            {
                !imageError
                    ?   <ImageRN
                            source={ formatImageSource(source) }
                            onError={ handleImageLoadError }
                            onLoad={ handleImageLoaded }
                            style={ [styles.image, imageStyle] }
                        />
                    :   <DefaultElement
                            icon={ alt }
                            style={ [styles.image, imageStyle] }
                        />
            }
            {
                children &&
                <View style={ styles.contentContainer }>
                    {
                        overlay && !imageError &&
                        <LinearGradient
                            locations={[ 0, 0.85 ]}
                            colors={ [hexToRgba(theme.colors.black, 0.15), hexToRgba(theme.colors.black, 0.90)] }
                            style={ styles.imageOverlay }
                        />
                    }
                    { children }
                </View>
            }
        </>
    )
}

const useStyles = (a: StyleProp<ViewStyle>) =>
    StyleSheet.create({
        overlay: {
            ...StyleSheet.absoluteFillObject,
            zIndex: 1,
            backgroundColor: hexToRgba(theme.colors.white, 0.035),
            borderRadius: 35,
        },
        contentContainer: {
            flex: 1,
            borderWidth: 1.5,
            borderRadius: 35,
            borderColor: theme.colors.gray4
        },
        image: {
            position: "absolute",
            width: "100%",
            height: "100%",
            // resizeMode: "cover",
            borderRadius: 35,
        },
        imageOverlay: {
            ...StyleSheet.absoluteFillObject,
            borderRadius: 33,
        },
    });

export default Image;