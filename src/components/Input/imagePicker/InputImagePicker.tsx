import Button from "../../Button/Button.ts";
import { pickImage } from "../../../utils/pickImage";
import { ImageStyle, Platform, StyleSheet, View } from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Carousel, CarouselItemType } from "../../Carousel/Carousel";
import { SharedValue } from "react-native-reanimated";
import CarouselItem from "../../Carousel/CarouselItem.tsx";
import { COLORS, FONT_SIZES, ICON_NAMES, SEPARATOR_SIZES } from "../../../constants";
import InputTitle from "../common/InputTitle.tsx";
import DefaultElement from "../../DefaultElement.tsx";
import { hexToRgba } from "../../../utils/colors/hexToRgba.ts";
import Image from "../../Image.tsx";
import { Image as ImageType } from "../../../types/zodTypes.ts";
import { useTranslation } from "react-i18next";
import { useInputFieldContext } from "../../../contexts/inputField/InputFieldContext.ts";
import { usePermission } from "../../../hooks/usePermission.ts";
import { ViewStyle } from "../../../types";
import { INPUT_IMAGE_TEMP_DIR } from "./imageTempDirectory";

type InputImagePickerProps = {
    defaultImages?: Array<ImageType>
    limitOfImages?: number
    alt?: string
    multipleSelection?: boolean
    setValue?: (image: Array<ImageType> | ImageType | null) => void
    imageStyle?: ImageStyle
    historyImageStyle?: ViewStyle
}

function InputImagePicker({
    defaultImages = [],
    limitOfImages = 5,
    alt,
    multipleSelection = false,
    setValue,
    imageStyle,
    historyImageStyle
}: InputImagePickerProps) {
    if(!defaultImages) throw new Error("DefaultImages is invalid");

    const { t } = useTranslation();
    const { askMediaLibraryPermission, askCameraPermission } = usePermission();

    const inputFieldContext = useInputFieldContext();
    const onChange = inputFieldContext?.field?.onChange;
    const fieldValue = useMemo(() => {
        const value = inputFieldContext?.field?.value;
        if(value !== undefined) return Array.isArray(value) ? null : value;

        return defaultImages.length === 0 || multipleSelection ? null : defaultImages[0];
    }, [inputFieldContext?.field?.value, defaultImages, multipleSelection]);

    const [selectedImage, setSelectedImage] = useState<ImageType | null>(fieldValue);
    const [history, setHistory] = useState<Array<ImageType>>(defaultImages ?? []);
    const [carouselLayout, setCarouselLayout] = useState({ width: 0, height: 0 });
    const [cameraAvailable, setCameraAvailable] = useState(Platform.OS !== "web");

    useEffect(() => {
        if(Platform.OS !== "web") return;

        let active = true;
        const mediaDevices = typeof navigator !== "undefined" ? navigator.mediaDevices : undefined;

        const updateCameraAvailability = async () => {
            if(!mediaDevices?.enumerateDevices) {
                if(active) setCameraAvailable(false);
                return;
            }

            try {
                const devices = await mediaDevices.enumerateDevices();
                if(active) setCameraAvailable(devices.some(device => device.kind === "videoinput"));
            } catch {
                if(active) setCameraAvailable(false);
            }
        };

        void updateCameraAvailability();
        mediaDevices?.addEventListener?.("devicechange", updateCameraAvailability);

        return () => {
            active = false;
            mediaDevices?.removeEventListener?.("devicechange", updateCameraAvailability);
        };
    }, []);

    useEffect(() => {
        const newValue = inputFieldContext?.field.value;
        if(!Array.isArray(newValue) && selectedImage !== newValue) selectImage(newValue, false);
    }, [inputFieldContext?.field.value]);

    const handleLayout = (event: any) => {
        const { width, height } = event.nativeEvent.layout;
        setCarouselLayout({ width, height });
    };

    const removeImageFromHistory = (index: number) => {
        if(index <= -1 || index > history.length - 1) {
            return;
        }

        setHistory(prevHistory => [...prevHistory.slice(0, index), ...prevHistory.slice(index + 1)]);
    };

    const getImages = async (type: "CAMERA" | "GALLERY") => {
        if(Platform.OS !== "web") {
            const permissionGranted = type === "CAMERA"
                                      ? await askCameraPermission()
                                      : await askMediaLibraryPermission();
            if(!permissionGranted) return;
        }

        const images = await pickImage(
            type,
            {
                directory: INPUT_IMAGE_TEMP_DIR,
                allowsMultipleSelection: multipleSelection,
                selectionLimit: limitOfImages
            }
        );

        if(!images || images.length === 0) return;

        selectImage(images[0]);

        if(images.length > 1) addImagesToHistory(images.slice(1));
    };

    const addImagesToHistory = (newImages: Array<ImageType>) => {
        setHistory(prevHistory => {
            const newHistoryLength = history.length + newImages.length;
            const limit = limitOfImages + defaultImages.length;

            if(newHistoryLength > limit) {
                const removeStartIndex = defaultImages.length;
                const removeEndIndex = defaultImages.length + newHistoryLength - limit - 1;

                if(removeEndIndex >= limit) {
                    return [...newImages.slice(0, limit + 1)];
                }

                return [
                    ...prevHistory.slice(0, removeStartIndex),
                    ...prevHistory.slice(removeEndIndex + 1),
                    ...newImages
                ];
            }

            return [...prevHistory, ...newImages];
        });
    };

    const selectImage = (newImage: ImageType | null, userSelection: boolean = true) => {
        if(multipleSelection) return;

        if(userSelection) {
            if(onChange) onChange(newImage);
            if(setValue) setValue(newImage);
        }

        if(newImage?.uri === selectedImage?.uri) return;

        const previousSelectedImage = selectedImage;

        if(history.length + 1 > limitOfImages + defaultImages.length) {
            setHistory(prevHistory => {
                let removeIndex = defaultImages.length;
                return [...prevHistory.slice(0, removeIndex), ...prevHistory.slice(removeIndex + 1)];
            });
        }

        setSelectedImage(newImage);
        setHistory(prevHistory => {
            const filteredHistory = prevHistory.filter(img => img.uri !== newImage?.uri);
            const shouldStoreOld = previousSelectedImage && !defaultImages.includes(previousSelectedImage);

            if(shouldStoreOld) return [...filteredHistory, previousSelectedImage];

            return filteredHistory;
        });
    };

    const isRemoteAttachment = (image?: ImageType | null) => Platform.OS === "web" && !!image &&
        image.uri === image.fileName && !/^(blob:|data:|https?:|file:)/i.test(image.uri);

    const renderHistoryItem = useCallback((
        item: ImageType,
        index: number,
        size: number,
        coordinate: SharedValue<number>
    ) => {
        const itemCarousel: CarouselItemType = {
            id: item.uri,
            image: { uri: item.uri, attachment: isRemoteAttachment(item) }
        };

        return (
            <CarouselItem
                index={ index }
                size={ size }
                x={ coordinate }
                item={ itemCarousel }
                cardAction={ () => selectImage(item) }
                containerStyle={ [
                    {
                        height: carouselLayout.height,
                        width: size
                    },
                    imageStyle,
                    historyImageStyle
                ] }
                renderBottomActionButton={
                    () =>
                        <Button.Icon
                            icon={ ICON_NAMES.close }
                            iconSize={ FONT_SIZES.p1 }
                            iconColor={ COLORS.redLight }
                            width={ FONT_SIZES.p1 * 1.2 }
                            height={ FONT_SIZES.p1 * 1.2 }
                            backgroundColor={ hexToRgba(COLORS.black, 0.75) }
                            onPress={ () => removeImageFromHistory(index) }
                            style={ { borderColor: COLORS.redLight, borderWidth: 2 } }
                        />
                }
            />
        );
    }, [isRemoteAttachment, removeImageFromHistory, selectImage]);

    const keyExtractor = useCallback((item: ImageType) => item.uri, []);

    const getWidth = () => {
        const width = StyleSheet.flatten(historyImageStyle)?.width ?? imageStyle?.width ?? carouselLayout.width;
        return typeof width === "number" ? width : carouselLayout.width;
    };

    return (
        <View style={ styles.inputContainer }>
            {
                !multipleSelection &&
               <>
                  <View style={ [styles.chosenImageContainer, imageStyle] }>
                     <Image
                        path={ selectedImage?.uri }
                        attachment={ isRemoteAttachment(selectedImage) }
                        alt={ alt }
                        imageStyle={ [styles.chosenImage, imageStyle] }
                     >
                         {
                             !!selectedImage &&
                            <View style={ styles.chosenImageActionContainer }>
                               <Button.Icon
                                  icon={ ICON_NAMES.close }
                                  iconSize={ FONT_SIZES.p1 }
                                  iconColor={ COLORS.redLight }
                                  width={ FONT_SIZES.p1 * 1.2 }
                                  height={ FONT_SIZES.p1 * 1.2 }
                                  backgroundColor={ hexToRgba(COLORS.black, 0.75) }
                                  onPress={ () => selectImage(null) }
                                  style={ { alignSelf: "flex-end", borderColor: COLORS.redLight, borderWidth: 2 } }
                               />
                            </View>
                         }
                     </Image>
                  </View>
                  <InputTitle title={ t("form.image_picker.selectable_images") }/>
               </>
            }
            <View style={ styles.secondRowContainer }>
                <View style={ styles.uploadButtonContainer }>
                    <Button.Icon
                        icon={ ICON_NAMES.upload }
                        onPress={ () => getImages("GALLERY") }
                    />
                    { cameraAvailable &&
                       <Button.Icon
                          icon={ ICON_NAMES.cameraPlus }
                          onPress={ () => getImages("CAMERA") }
                       /> }
                </View>
                <View style={ styles.imagesContainer } onLayout={ handleLayout }>
                    <Carousel
                        data={ history }
                        renderItem={ renderHistoryItem }
                        spacer={ 0 }
                        contentWidth={ getWidth() }
                        renderDefaultItem={ (size) => (
                            <DefaultElement
                                style={ [
                                    {
                                        height: carouselLayout.height,
                                        width: size
                                    },
                                    imageStyle,
                                    historyImageStyle
                                ] }
                                icon={ alt }
                                onPress={ () => selectImage(null) }
                            />
                        ) }
                        keyExtractor={ keyExtractor }
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: "column",
        gap: SEPARATOR_SIZES.lightSmall
    },
    chosenImage: {
        resizeMode: "stretch",
        borderRadius: 35
    },
    chosenImageContainer: {
        position: "relative",
        width: "100%",
        alignSelf: "stretch",
        flexShrink: 0
    },
    chosenImageActionContainer: {
        flex: 1,
        alignItems: "flex-end",
        justifyContent: "flex-end",
        padding: SEPARATOR_SIZES.small
    },
    secondRowContainer: {
        flexDirection: "row",
        gap: SEPARATOR_SIZES.lightSmall
    },
    uploadButtonContainer: {
        flex: 0.25,
        justifyContent: "center",
        alignItems: "center",
        gap: SEPARATOR_SIZES.small
    },
    imagesContainer: {
        flex: 1
    }
});

export default InputImagePicker;
