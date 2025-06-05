import React from "react";
import Carousel, { CarouselItemType } from "../../../components/Carousel/Carousel";
import { Text, StyleSheet, View } from "react-native";
import { DEFAULT_SEPARATOR, GLOBAL_STYLE, ICON_NAMES } from "../../../constants/constants";
import { SharedValue } from "react-native-reanimated";
import CarouselItem from "../../../components/Carousel/CarouselItem";
import DefaultElement from "../../../components/DefaultElement";
import Button from "../../../components/Button/Button";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import useMyGarage from "../hooks/useMyGarage";

const MyGarageBlock: React.FC = () => {
    const {
        cars,
        isLoading,
        openNewCarForm,
        openCarProfile
    } = useMyGarage();

    const renderDefaultElement =
        (size: number, spacerSize: number) =>
            <View style={ styles.defaultElementContainer }>
                <DefaultElement
                    isLoading={ isLoading }
                    icon={ ICON_NAMES.car }
                    text="Még egy autó se parkol a virtuális garázsában"
                    style={{ width: size - spacerSize / 2 }}
                />
            </View>

    const renderCarouselItem =
        (item: CarouselItemType, index: number, size: number, coordinate: SharedValue<number>) =>
            <CarouselItem
                index={ index }
                size={ size }
                x={ coordinate }
                overlay
                item={ item }
                cardAction={ () => openCarProfile(item?.id || index.toString()) }
            />

    return (
        <View style={ styles.contentContainer } >
            <View style={{ paddingHorizontal: DEFAULT_SEPARATOR }}>
                <Text style={ GLOBAL_STYLE.containerTitleText }>
                    Garázs
                </Text>
                <Text style={ GLOBAL_STYLE.containerText }>
                    Rendelkezzen a virutális garázsában parkoló autókról!
                </Text>
            </View>
            <View style={ styles.carouselContainer }>
                <Carousel
                    data={ cars }
                    renderItem={ renderCarouselItem }
                    renderDefaultItem={ renderDefaultElement }
                />
            </View>
            <Button.Text
                text="Autó hozzáadás"
                width={ wp(75) }
                onPress={ openNewCarForm }
            />
        </View>
    )
}

const styles = StyleSheet.create({
    contentContainer: {
        ...GLOBAL_STYLE.contentContainer,
        paddingTop: 0,
        paddingBottom: GLOBAL_STYLE.contentContainer.gap,
        paddingHorizontal: 0,
        marginHorizontal: 0,
        backgroundColor: "transparent"
    },
    carouselContainer: {
        height: hp(27.5),
    },
    defaultElementContainer: {
        flex: 1
    }
});

export default React.memo(MyGarageBlock);