import Button from "../../Button/Button.ts";
import { pickImage } from "../../../utils/pickImage.ts";
import { StyleSheet, View, ViewStyle } from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Carousel, { CarouselItemType } from "../../Carousel/Carousel.tsx";
import { SharedValue } from "react-native-reanimated";
import CarouselItem from "../../Carousel/CarouselItem.tsx";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { COLORS, FONT_SIZES, ICON_NAMES, SEPARATOR_SIZES } from "../../../constants/index.ts";
import InputTitle from "../common/InputTitle.tsx";
import DefaultElement from "../../DefaultElement.tsx";
import { hexToRgba } from "../../../utils/colors/hexToRgba.ts";
import Image from "../../Image.tsx";
import { Image as ImageType } from "../../../types/zodTypes.ts";
import { useTranslation } from "react-i18next";
import { useInputFieldContext } from "../../../contexts/inputField/InputFieldContext.ts";
import { Paths } from "expo-file-system";

export const INPUT_IMAGE_TEMP_DIR = `${ Paths.document.uri }/temp`;

type InputImagePickerProps = {
    defaultImages?: Array<ImageType>
    limitOfImages?: number
    alt?: string
    multipleSelection?: boolean
    setValue?: (image: Array<ImageType> | ImageType) => void
    imageStyle?: ViewStyle
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
    const inputFieldContext = useInputFieldContext();
    const onChange = inputFieldContext?.field?.onChange;
    const fieldValue = useMemo(() => inputFieldContext?.field?.value ?? (defaultImages.length === 0 || multipleSelection)
                                     ? null
                                     : defaultImages[0], [inputFieldContext?.field.value]);

    const [selectedImage, setSelectedImage] = useState<ImageType | null>(fieldValue);
    const [history, setHistory] = useState<Array<ImageType>>(defaultImages ?? []);
    const [carouselLayout, setCarouselLayout] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const newValue = inputFieldContext?.field.value;
        if(newValue && !Array.isArray(newValue) && selectedImage !== newValue) selectImage(newValue);
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

    const getImages = async (type: "CAMERA" | "GALLERY", onChange: (...event: any[]) => void) => {
        const images = await pickImage(
            type,
            {
                directory: INPUT_IMAGE_TEMP_DIR,
                allowsMultipleSelection: multipleSelection,
                selectionLimit: limitOfImages
            }
        );

        if(!images || images.length === 0) return;

        if(onChange) onChange(images[0]);
        if(setValue) setValue(images[0]);

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

    const selectImage = (newImage: ImageType | null) => {
        if(multipleSelection) return;

        if(history.length + 1 > limitOfImages + defaultImages.length) {
            setHistory(prevHistory => {
                let removeIndex = defaultImages.length;
                return [...prevHistory.slice(0, removeIndex), ...prevHistory.slice(removeIndex + 1)];
            });
        }

        setSelectedImage(prevSelectedImage => {
            let removeIndex =
                defaultImages.includes(newImage)
                ? -1
                : history.indexOf(newImage);

            setHistory(prevHistory => {
                return (
                    prevSelectedImage
                    ? defaultImages.includes(prevSelectedImage)
                      ? removeIndex !== -1
                        ? [...prevHistory.slice(0, removeIndex), ...prevHistory.slice(removeIndex + 1)]
                        : [...prevHistory]
                      : removeIndex !== -1
                        ? [
                                ...prevHistory.slice(0, removeIndex),
                                ...prevHistory.slice(removeIndex + 1),
                                prevSelectedImage
                            ]
                        : [...prevHistory, prevSelectedImage]
                    : removeIndex !== -1
                      ? [...prevHistory.slice(0, removeIndex), ...prevHistory.slice(removeIndex + 1)]
                      : [...prevHistory]
                );
            });

            return newImage;
        });
    };

    const renderHistoryItem = useCallback((
        item: ImageType,
        index: number,
        size: number,
        coordinate: SharedValue<number>
    ) => {
        const itemCarousel: CarouselItemType = { id: item.uri, image: { uri: item.uri, attachment: false } };

        return (
            <CarouselItem
                index={ index }
                size={ size }
                x={ coordinate }
                item={ itemCarousel }
                cardAction={ () => selectImage(item) }
                containerStyle={ {
                    height: carouselLayout.height,
                    width: size,
                    ...imageStyle,
                    ...historyImageStyle
                } }
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
    }, [removeImageFromHistory, selectImage]);

    return (
        <View style={ styles.inputContainer }>
            {
                !multipleSelection &&
               <>
                  <Image
                     path={ selectedImage?.uri }
                     attachment={ false }
                     alt={ alt }
                     imageStyle={ {
                         ...styles.chosenImage,
                         ...(selectedImage ? {} : { position: "relative" }),
                         ...(imageStyle ?? {})
                     } }
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
                  <InputTitle title={ t("form.image_picker.selectable_images") }/>
               </>
            }
            <View style={ styles.secondRowContainer }>
                <View style={ styles.uploadButtonContainer }>
                    <Button.Icon
                        icon={ ICON_NAMES.upload }
                        onPress={ () => getImages("GALLERY", onChange) }
                    />
                    <Button.Icon
                        icon={ ICON_NAMES.cameraPlus }
                        onPress={ () => getImages("CAMERA", onChange) }
                    />
                </View>
                <View style={ styles.imagesContainer } onLayout={ handleLayout }>
                    <Carousel
                        data={ history }
                        renderItem={ renderHistoryItem }
                        spacer={ 0 }
                        contentWidth={ historyImageStyle?.width ?? imageStyle?.width ?? carouselLayout.width }
                        containerStyle={ { height: hp(20) } }
                        renderDefaultItem={ (size) => (
                            <DefaultElement
                                style={ {
                                    height: carouselLayout.height,
                                    width: size,
                                    ...imageStyle,
                                    ...historyImageStyle
                                } }
                                icon={ alt }
                                onPress={ () => selectImage(null) }
                            />
                        ) }
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
        alignSelf: "flex-start",
        resizeMode: "stretch",
        borderRadius: 35
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