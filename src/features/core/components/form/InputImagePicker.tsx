import Button from "../shared/Button"
import { pickImage } from "../../utils/pickImage";
import {
    Image,
    ImageSourcePropType,
    Text,
    TouchableOpacity,
    View,
    StyleSheet
} from "react-native";
import { encode } from "base64-arraybuffer";
import { Control, Controller } from "react-hook-form";
import { useState } from "react";
import Carousel, { CarouselItemType } from "../carousel/Carousel";
import { SharedValue } from "react-native-reanimated";
import CarouselItem from "../carousel/CarouselItem";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { formatImageSource } from "../../utils/formatImageSource";
import { Icon, IconButton } from "react-native-paper";
import {FONT_SIZES, GET_ICON_BUTTON_RESET_STYLE, ICON_NAMES, SEPARATOR_SIZES } from "../../constants/constants";
import { theme } from "../../constants/theme";
import InputTitle from "./InputTitle";
import hexToRgba from "hex-to-rgba";

interface InputImagePickerProps {
    control: Control<any>
    fieldName: string
    fieldNameText?: string
    fieldInfoText?: string
    defaultImages?: Array<ImageSourcePropType | string>
    limitOfImages?: number
    multipleSelection?: boolean
}

const InputImagePicker:React.FC<InputImagePickerProps> = ({
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

    const addImagesToHistory = (newImages: Array<ImageSourcePropType | string>) => {
        setHistory(prevHistory => {
            const newHistoryLength = history.length + newImages.length;
            const limit = limitOfImages + defaultImages.length;

            if(newHistoryLength > limit) {
                const removeStartIndex = defaultImages.length;
                const removeEndIndex = newHistoryLength - limit;

                if(removeEndIndex >= limit){
                    return [...newImages.slice(0, limit)];
                }

                return [...prevHistory.slice(0, removeStartIndex), ...prevHistory.slice(removeEndIndex + 1), ...newImages];
            }
            console.log(newHistoryLength, [...prevHistory, ...newImages].length)
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

    const [size, setSize] = useState({ width: 0, height: 0 });

    const handleLayout = (event: any) => {
        const { width, height } = event.nativeEvent.layout;
        setSize({ width, height });
    };

    return (
        <Controller
            control={ control }
            name={ fieldName }
            render={
                ({ field: { onChange }, fieldState: {error} }) =>
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
                                    source={
                                        history.length === 0
                                            ? require("../../../../assets/images/car1.jpg")
                                            : formatImageSource(selectedImage || require("../../../../assets/images/car2.jpg"))
                                    }
                                    style={ [styles.chosenImage, { height: size.height * 1.25 }] }
                                />
                                <InputTitle title="Kiválasztható képek" />
                            </>
                        }
                        <View style={ styles.secondRowContainer }>
                            <View style={ styles.uploadButtonContainer }>
                                <Button
                                    icon={ ICON_NAMES.upArrowHead }
                                    onPress={
                                        async () => {
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
                                    }
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
                                                    onPress={ () => selectImage(item) }
                                                />
                                            )
                                        }
                                    }
                                    renderDefaultItem={
                                        () =>
                                            <View style={ styles.defaultItemContainer }>
                                                <IconButton
                                                    icon={ ICON_NAMES.image }
                                                    size={ FONT_SIZES.extraLarge }
                                                    iconColor={ theme.colors.gray3 }
                                                    style={ GET_ICON_BUTTON_RESET_STYLE(FONT_SIZES.extraLarge) }
                                                />
                                            </View>
                                    }
                                />
                            </View>
                            {
                                error ? <Text style={{ color: "green" }}>{error.message}</Text> : <></>
                            }
                        </View>
                    </View>
            }
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
        // height: 150,
    },
    uploadButtonContainer: {
        flex: 0.25,
        justifyContent: "center",
        alignItems: "center",
    },
    imagesContainer: {
        flex: 1,
        height: hp(17.5),
    },
    defaultItemContainer: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: hexToRgba(theme.colors.gray4, 0.65),
        borderWidth: 0.5,
        borderRadius: 38,
        borderColor: theme.colors.gray3
    },
    defaultItemImage: {
        width: "100%",
        height: hp(17.5),
        resizeMode: "stretch",
        borderRadius: 35,
    },
});

export default InputImagePicker;