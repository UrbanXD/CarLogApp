import React, {useCallback, useState} from "react";
import {formatImageSource} from "../../Shared/utils/formatImageSource";
import {ImageSourcePropType, Image as ImageRN, StyleProp, View, ViewStyle, StyleSheet, ImageStyle} from "react-native";
import DefaultElement from "../../Shared/components/DefaultElement";
import {ICON_NAMES} from "../../Shared/constants/constants";
import {theme} from "../../Shared/constants/theme";
import {hexToRgba} from "../../Shared/utils/colors/hexToRgba";
import {LinearGradient} from "expo-linear-gradient";

interface ImageProps {
    source: ImageSourcePropType | string
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

    const handleImageLoadError = useCallback(
        () => {
            setImageError(true);
        },
        []
    );

    const styles = useStyles(imageStyle);

    return (
        <>
            {
                !imageError
                    ?   <ImageRN
                            source={ formatImageSource(source) }
                            onError={ handleImageLoadError }
                            style={ [styles.image, imageStyle] }
                        />
                    :   <View style={ [styles.image, imageStyle] }>
                            <DefaultElement
                                icon={ alt }
                            />
                        </View>
            }
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
            resizeMode: "cover",
            borderRadius: 35,
        },
        imageOverlay: {
            ...StyleSheet.absoluteFillObject,
            borderRadius: 33,
        },
    });

export default Image;