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
import { Icon } from "react-native-paper";
import { ICON_NAMES } from "../../constants/constants";
import { theme } from "../../constants/theme";

interface InputImagePickerProps {
    control: Control<any>
    fieldName: string
    fieldNameText?: string
    defaultImages?: Array<ImageSourcePropType | string>
    limitOfImages?: number
    multipleSelection?: boolean
}

const InputImagePicker:React.FC<InputImagePickerProps> = ({
    control,
    fieldName,
    fieldNameText,
    defaultImages = [],
    limitOfImages = 5,
    multipleSelection = false,
}) => {
    const [selectedImage, setSelectedImage] = useState<ImageSourcePropType | string | undefined>(defaultImages.length === 0 || multipleSelection ? undefined : defaultImages[0]);
    const [history, setHistory] = useState(defaultImages);

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

    return (
        <Controller
            control={ control }
            name={ fieldName }
            render={
                ({ field: { value, onChange }, fieldState: {error} }) =>
                    <View style={{ height: hp(27.5) }}>
                        {
                            !multipleSelection &&
                            <Image
                                source={
                                    history.length === 0
                                        ? require("../../../../assets/images/car1.jpg")
                                        : formatImageSource(selectedImage || require("../../../../assets/images/car2.jpg"))
                                }
                                style={{
                                    width: 150,
                                    height: 100
                                }}
                            />
                        }
                        <Carousel
                            data={ history }
                            itemSizePercentage={ 0.55 }
                            spacer={ 0 }
                            renderItem={
                                (item: ImageSourcePropType, index: number, size: number, coordinate: SharedValue<number> ) => {
                                    const itemCarousel: CarouselItemType = {
                                        image: item
                                    }
                                    return (
                                        <>
                                            {
                                                index === 0
                                                ?   <TouchableOpacity
                                                        style={{ width: size }}
                                                        activeOpacity={ 1 }
                                                        onPress={
                                                            async () => {
                                                                const images = await pickImage({
                                                                    allowsMultipleSelection: multipleSelection,
                                                                    selectionLimit: limitOfImages
                                                                });

                                                                if(!images){
                                                                    return;
                                                                }
                                                                
                                                                onChange(images[0]);
                                                                selectImage(encode(images[0].buffer));
                                                            }
                                                        }
                                                    >
                                                        <View style={styles.container}>
                                                            <Icon
                                                                source={ ICON_NAMES.addImage }
                                                                size={ size / 2.5 }
                                                                color={ theme.colors.white }
                                                            />
                                                            <View style={[styles.corner, styles.topLeft]} />
                                                            <View style={[styles.corner, styles.topRight]} />
                                                            <View style={[styles.corner, styles.bottomLeft]} />
                                                            <View style={[styles.corner, styles.bottomRight]} />
                                                        </View>
                                                </TouchableOpacity>
                                                :   <></>
                                            }
                                            <></>
                                            <CarouselItem
                                                index={ index }
                                                size={ size }
                                                x={ coordinate }
                                                item={ itemCarousel }
                                                onPress={ () => selectImage(item) }
                                            />
                                        </>
                                    )
                                }
                            }
                        />
                        {
                            error ? <Text style={{ color: "green" }}>{error.message}</Text> : <></>
                        }
                    </View>
            }
        />
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        marginRight: 50,
    },
    corner: {
        position: 'absolute',
        width: 50,
        height: 50,
        borderColor: theme.colors.gray2,
        borderRadius: 5
    },
    topLeft: {
        top: 0,
        left: 0,
        borderTopWidth: 6,
        borderLeftWidth: 6,
        borderRightWidth: 0,
        borderBottomWidth: 0,
    },
    topRight: {
        top: 0,
        right: 0,
        borderTopWidth: 6,
        borderRightWidth: 6,
        borderLeftWidth: 0,
        borderBottomWidth: 0,
    },
    bottomLeft: {
        bottom: 0,
        left: 0,
        borderBottomWidth: 6,
        borderLeftWidth: 6,
        borderTopWidth: 0,
        borderRightWidth: 0,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        borderBottomWidth: 6,
        borderRightWidth: 6,
        borderTopWidth: 0,
        borderLeftWidth: 0,
    },
});

export default InputImagePicker;