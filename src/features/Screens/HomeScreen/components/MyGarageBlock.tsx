import React, {useEffect, useState} from "react";
import {useBottomSheet} from "../../../BottomSheet/context/BottomSheetProvider";
import {RootState} from "../../../Database/redux/store";
import {useSelector} from "react-redux";
import Carousel, {CarouselItemType} from "../../../Carousel/components/Carousel";
import NewCarForm from "../../../Form/layouts/addCar/NewCarForm";
import {Alert, Text, StyleSheet, View} from "react-native";
import CarInfo from "../../../carInfo/CarInfo";
import {DEFAULT_SEPARATOR, GLOBAL_STYLE, ICON_NAMES, SEPARATOR_SIZES} from "../../../Shared/constants/constants";
import {SharedValue} from "react-native-reanimated";
import CarouselItem from "../../../Carousel/components/CarouselItem";
import DefaultElement from "../../../Shared/components/DefaultElement";
import Button from "../../../Button/components/Button";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import useMyGarage from "../hooks/useMyGarage";

const MyGarageBlock: React.FC = () => {
    const {
        cars,
        isLoading,
        openNewCarBottomSheet,
        openCarInfoBottomSheet
    } = useMyGarage();

    const renderDefaultElement =
        (size: number, spacerSize: number) =>
            <DefaultElement
                isLoading={ isLoading }
                icon={ ICON_NAMES.car }
                text="Még egy autó se parkol a virtuális garázsában"
                style={{ width: size - spacerSize / 2 }}
            />

    const renderCarouselItem =
        (item: CarouselItemType, index: number, size: number, coordinate: SharedValue<number>) =>
            <CarouselItem
                index={ index }
                size={ size }
                x={ coordinate }
                overlay
                item={ item }
                cardAction={ () => openCarInfoBottomSheet(index) }
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
                onPress={ openNewCarBottomSheet }
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
    }
});

export default React.memo(MyGarageBlock);