import Button from "../../shared/button/Button"
import { pickImage } from "../../../utils/pickImage";
import {
    Image,
    ImageSourcePropType,
    Text,
    View,
    StyleSheet
} from "react-native";
import { encode } from "base64-arraybuffer";
import { Control, Controller } from "react-hook-form";
import React, { useState } from "react";
import Carousel, { CarouselItemType } from "../../shared/carousel/Carousel";
import { SharedValue } from "react-native-reanimated";
import CarouselItem from "../../shared/carousel/CarouselItem";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { formatImageSource } from "../../../utils/formatImageSource";
import {ControllerRenderArgs, FONT_SIZES, ICON_NAMES, SEPARATOR_SIZES } from "../../../constants/constants";
import InputTitle from "../InputTitle";
import DefaultImage from "../../shared/DefaultImage";
import { theme } from "../../../constants/theme";
import Icon from "../../shared/Icon";
import { hexToRgba } from "../../../utils/colors/hexToRgba";

interface InputImagePickerProps {
    control: Control<any>
    fieldName: string
    fieldNameText?: string
    fieldInfoText?: string
    defaultImages?: Array<ImageSourcePropType | string>
    limitOfImages?: number
    multipleSelection?: boolean
}

const InputImagePicker: React.FC<InputImagePickerProps> = ({
    control,
    fieldName,
    fieldNameText,
    fieldInfoText,
    defaultImages = [],
    limitOfImages = 5,
    multipleSelection = false,
}) => {
    const [selectedImage, setSelectedImage] = useState<ImageSourcePropType | string | undefined>(defaultImages.length === 0 || multipleSelection ? undefined : defaultImages[0]);
    const [history, setHistory] = useState(defaultImages);
    const [size, setSize] = useState({ width: 0, height: 0 });

    const handleLayout = (event: any) => {
        const { width, height } = event.nativeEvent.layout;
        setSize({ width, height });
    };

    const removeImageFromHistory = (index: number) => {
        if(index <= -1 || index > history.length - 1) {
            return;
        }

        setHistory(prevHistory => [...prevHistory.slice(0, index), ...prevHistory.slice(index + 1)]);
    }

    const getImages = async (onChange: (...event: any[]) => void) => {
        const images = await pickImage({
            allowsMultipleSelection: multipleSelection,
            selectionLimit: limitOfImages
        });

        if(!images){
            return;
        }

        if(!multipleSelection) {
            selectImage(encode(images[0].buffer));
        } else {
            addImagesToHistory(images.map(img => encode(img.buffer)));
        }

        onChange(images[0]);
    }

    const addImagesToHistory = (newImages: Array<ImageSourcePropType | string>) => {
        setHistory(prevHistory => {
            const newHistoryLength = history.length + newImages.length;
            const limit = limitOfImages + defaultImages.length;

            if(newHistoryLength > limit) {
                const removeStartIndex = defaultImages.length;
                const removeEndIndex = defaultImages.length + newHistoryLength - limit - 1;

                if(removeEndIndex >= limit){
                    return [...newImages.slice(0, limit + 1)];
                }

                return [...prevHistory.slice(0, removeStartIndex), ...prevHistory.slice(removeEndIndex + 1), ...newImages];
            }

            return [...prevHistory, ...newImages];
        })
    }

    const selectImage = (newImage: ImageSourcePropType | string) => {
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
                                ? [...prevHistory.slice(0, removeIndex), ...prevHistory.slice(removeIndex + 1), prevSelectedImage]
                                : [...prevHistory, prevSelectedImage]
                        : removeIndex !== -1
                            ? [...prevHistory.slice(0, removeIndex), ...prevHistory.slice(removeIndex + 1)]
                            : [...prevHistory]
                )
            })

            return newImage;
        });
    }

    const render = (args: ControllerRenderArgs) => {
        const { field: { onChange }, fieldState: { error } } = args;

        return (
            <View style={ styles.inputContainer }>
                {
                    fieldNameText &&
                    <InputTitle
                        title={ fieldNameText }
                        subtitle={ fieldInfoText }
                    />
                }
                {
                    !multipleSelection &&
                    <>
                        <Image
                            source={ formatImageSource(selectedImage || require("../../../../../assets/images/car2.jpg")) }
                            style={ [styles.chosenImage, { height: size.height * 1.25 }] }
                        />
                        <InputTitle title="Kiválasztható képek" />
                    </>
                }
                <View style={ styles.secondRowContainer }>
                    <View style={ styles.uploadButtonContainer }>
                        <Button
                            icon={ ICON_NAMES.upArrowHead }
                            onPress={ () => getImages(onChange) }
                        />
                    </View>
                    <View style={ styles.imagesContainer } onLayout={ handleLayout }>
                        <Carousel
                            data={ history }
                            contentWidth={ size.width }
                            renderItem={
                                (item: ImageSourcePropType, index: number, size: number, coordinate: SharedValue<number> ) => {
                                    const itemCarousel: CarouselItemType = {
                                        image: item
                                    }
                                    return (
                                        <CarouselItem
                                            index={ index }
                                            size={ size }
                                            x={ coordinate }
                                            item={ itemCarousel }
                                            cardAction={ () => selectImage(item) }
                                            renderBottomActionButton={
                                                () =>
                                                    <Icon icon={ ICON_NAMES.close }
                                                        size={ FONT_SIZES.medium }
                                                        color={ theme.colors.redLight }
                                                        backgroundColor={ hexToRgba(theme.colors.black, 0.75) }
                                                        onPress={ () => removeImageFromHistory(index) }
                                                        style={ { borderColor: theme.colors.redLight, borderWidth: 2 } }
                                                    />
                                            }
                                        />
                                    )
                                }
                            }
                            renderDefaultItem={ () => <DefaultImage /> }
                        />
                    </View>
                    {
                        error ? <Text style={{ color: "green" }}>{error.message}</Text> : <></>
                    }
                </View>
            </View>
        )
    }

    return (
        <Controller
            control={ control }
            name={ fieldName }
            render={ render }
        />
    )
}

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: "column",
        gap: SEPARATOR_SIZES.lightSmall,
    },
    chosenImage: {
        width: "100%",
        resizeMode: "stretch",
        borderRadius: 35,
    },
    secondRowContainer: {
        flexDirection: "row",
        gap: SEPARATOR_SIZES.lightSmall,
    },
    uploadButtonContainer: {
        flex: 0.25,
        justifyContent: "center",
        alignItems: "center",
    },
    imagesContainer: {
        flex: 1,
        height: hp(17.5),
    }
});

export default InputImagePicker;