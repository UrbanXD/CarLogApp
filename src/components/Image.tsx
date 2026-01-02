import React, { ReactNode, useEffect, useState } from "react";
import { ActivityIndicator, Image as ImageRN, ImageStyle, StyleSheet, View } from "react-native";
import DefaultElement from "./DefaultElement";
import { COLORS, ICON_NAMES } from "../constants/index.ts";
import { hexToRgba } from "../utils/colors/hexToRgba";
import { LinearGradient } from "expo-linear-gradient";
import { useDatabase } from "../contexts/database/DatabaseContext.ts";
import { File } from "expo-file-system";

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
    const { attachmentQueue } = useDatabase();

    const [source, setSource] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(!!path);
    const [imageError, setImageError] = useState<boolean>(false);

    useEffect(() => {
        if(!path || (attachment && !attachmentQueue)) {
            setLoading(false);
            setImageError(true);
            return;
        }

        let isMounted = true;

        const loadImage = async () => {
            try {
                setLoading(true);
                let result = null;
                if(attachment && attachmentQueue) {
                    result = await attachmentQueue.getFile(path);
                } else {
                    const file = new File(path);
                    if(file.exists && file.size > 0) result = file.uri;
                }
                if(isMounted) {
                    if(result) {
                        setSource(result);
                        setImageError(false);
                    } else {
                        setImageError(true);
                    }
                }
            } catch(e) {
                if(isMounted) setImageError(true);
            } finally {
                if(isMounted) setLoading(false);
            }
        };

        loadImage();

        return () => { isMounted = false; };
    }, [path, attachmentQueue]);

    return (
        <>
            {
                loading
                ?
                <View
                    style={ [styles.image, imageStyle, { backgroundColor: COLORS.black5, justifyContent: "center" }] }>
                    <ActivityIndicator size={ "large" } color={ COLORS.gray2 }/>
                </View>
                : !imageError && source
                  ?
                  <ImageRN
                      source={ { uri: source } }
                      style={ [styles.image, imageStyle] }
                  />
                  :
                  <DefaultElement
                      icon={ alt }
                      style={ [styles.image, imageStyle] }
                  />
            }
            {
                children &&
               <View style={ [styles.contentContainer, imageStyle] }>
                   {
                       overlay && !imageError && source &&
                      <LinearGradient
                         locations={ [0, 0.85] }
                         colors={ [
                             hexToRgba(COLORS.black, 0.15),
                             hexToRgba(COLORS.black, 0.60)
                         ] }
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

export default React.memo(Image);