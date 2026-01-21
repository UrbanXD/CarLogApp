import React from "react";
import Carousel, { CarouselItemType } from "../../../components/Carousel/Carousel.tsx";
import { StyleSheet, Text, View } from "react-native";
import { DEFAULT_SEPARATOR, GLOBAL_STYLE, ICON_NAMES } from "../../../constants";
import { SharedValue } from "react-native-reanimated";
import CarouselItem from "../../../components/Carousel/CarouselItem.tsx";
import DefaultElement from "../../../components/DefaultElement.tsx";
import Button from "../../../components/Button/Button.ts";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import useGarage from "../hooks/useGarage.tsx";
import { useTranslation } from "react-i18next";

const Garage: React.FC = () => {
    const { t } = useTranslation();
    const { cars, isLoading, openNewCarForm, openCarProfile } = useGarage();

    const renderDefaultElement =
        (size: number, spacerSize: number, loading: boolean) => {
            return (
                <View style={ styles.defaultElementContainer }>
                    <DefaultElement
                        icon={ ICON_NAMES.car }
                        text={ t("garage.empty_car_list") }
                        style={ { width: size - spacerSize / 2 } }
                        loading={ loading }
                        loadingText={ t("garage.loading") }
                    />
                </View>);
        };

    const renderCarouselItem =
        (item: CarouselItemType, index: number, size: number, coordinate: SharedValue<number>) =>
            <CarouselItem
                index={ index }
                size={ size }
                x={ coordinate }
                overlay
                item={ item }
                cardAction={ () => openCarProfile(item.id) }
            />;

    return (
        <View style={ styles.contentContainer }>
            <View style={ { paddingHorizontal: DEFAULT_SEPARATOR } }>
                <Text style={ GLOBAL_STYLE.containerTitleText }>
                    { t("garage.garage") }
                </Text>
                <Text style={ GLOBAL_STYLE.containerText }>
                    { t("garage.use_garage") }
                </Text>
            </View>
            <View style={ styles.carouselContainer }>
                <Carousel
                    data={ cars }
                    loading={ isLoading }
                    renderItem={ renderCarouselItem }
                    renderDefaultItem={ renderDefaultElement }
                />
            </View>
            <Button.Text
                text={ t("garage.add_new_car") }
                width={ wp(75) }
                onPress={ openNewCarForm }
            />
        </View>
    );
};

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
        height: hp(27.5)
    },
    defaultElementContainer: {
        flex: 1
    }
});

export default React.memo(Garage);