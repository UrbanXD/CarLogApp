import React, { useState } from "react";
import { LayoutChangeEvent, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { COLORS, DEFAULT_SEPARATOR, FONT_SIZES, GLOBAL_STYLE, ICON_NAMES, SEPARATOR_SIZES } from "../../../constants";
import Button from "../../../components/Button/Button";
import DefaultElement from "../../../components/DefaultElement";
import Image from "../../../components/Image";
import { CarouselItemType } from "../../../components/Carousel/Carousel";
import useGarage from "../hooks/useGarage";
import { useTranslation } from "react-i18next";

const PAGE_MAX_WIDTH = 1280;
const CARD_MIN_WIDTH = 260;
const CARD_GAP = 18;

function Garage() {
    const { width: viewportWidth, height: viewportHeight } = useWindowDimensions();
    const [measuredWidth, setMeasuredWidth] = useState(0);
    const { t } = useTranslation();
    const { cars, isLoading, openNewCarForm, openCarProfile } = useGarage();
    const isPhoneLayout = viewportWidth <= 760;
    const availableWidth = measuredWidth || viewportWidth;
    const contentWidth = Math.min(PAGE_MAX_WIDTH, Math.max(0, availableWidth - DEFAULT_SEPARATOR * 2));
    const columnCount = Math.max(1, Math.floor((contentWidth + CARD_GAP) / (CARD_MIN_WIDTH + CARD_GAP)));
    const cardWidth = isPhoneLayout
                      ? Math.min(viewportWidth * 0.82, 560)
                      : (contentWidth - CARD_GAP * (columnCount - 1)) / columnCount;
    const cardHeight = isPhoneLayout
                       ? Math.min(260, Math.max(190, viewportHeight * 0.29))
                       : Math.min(300, Math.max(210, cardWidth * 0.63));

    const renderCard = (car: CarouselItemType) => (
        <Pressable
            key={ car.id }
            onPress={ () => openCarProfile(car.id) }
            style={ [styles.carCard, { width: cardWidth, height: cardHeight }] }
        >
            <Image
                path={ car.image?.uri }
                attachment={ car.image?.attachment ?? false }
                alt={ ICON_NAMES.car }
                imageStyle={ { width: "100%", height: "100%", borderRadius: 26 } }
            >
                <View style={ styles.cardContent }>
                    <Text numberOfLines={ 1 } style={ styles.carName }>{ car.title }</Text>
                    <View>
                        <Text numberOfLines={ 1 } style={ styles.carMake }>{ car.subtitle }</Text>
                        <Text numberOfLines={ 1 } style={ styles.carModel }>{ car.body }</Text>
                    </View>
                </View>
            </Image>
        </Pressable>
    );

    return (
        <View
            style={ styles.container }
            onLayout={ (event: LayoutChangeEvent) => setMeasuredWidth(event.nativeEvent.layout.width) }
        >
            <View style={ styles.heading }>
                <Text style={ GLOBAL_STYLE.containerTitleText }>{ t("garage.garage") }</Text>
                <Text style={ GLOBAL_STYLE.containerText }>{ t("garage.use_garage") }</Text>
            </View>

            {
                cars.length === 0
                ? <DefaultElement
                    icon={ ICON_NAMES.car }
                    text={ t("garage.empty_car_list") }
                    loading={ isLoading }
                    loadingText={ t("garage.loading") }
                    style={ [
                        styles.emptyState,
                        { width: isPhoneLayout ? "100%" : Math.min(contentWidth, 620), height: cardHeight }
                    ] }
                />
                : isPhoneLayout
                  ? <ScrollView
                      horizontal
                      snapToInterval={ cardWidth + CARD_GAP }
                      decelerationRate="fast"
                      showsHorizontalScrollIndicator={ false }
                      contentContainerStyle={ [
                          styles.phoneCarousel,
                          { paddingHorizontal: Math.max(0, (viewportWidth - cardWidth) / 2) }
                      ] }
                  >
                      { cars.map(renderCard) }
                  </ScrollView>
                  : <View style={ [styles.grid, { maxWidth: contentWidth }] }>
                      { cars.map(renderCard) }
                  </View>
            }

            <Button.Text
                text={ t("garage.add_new_car") }
                width={ isPhoneLayout ? Math.min(viewportWidth - 2 * DEFAULT_SEPARATOR, 480) : 240 }
                onPress={ openNewCarForm }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: SEPARATOR_SIZES.medium,
        paddingBottom: SEPARATOR_SIZES.normal,
        paddingHorizontal: DEFAULT_SEPARATOR,
        width: "100%"
    },
    heading: {
        gap: SEPARATOR_SIZES.lightSmall
    },
    grid: {
        width: "100%",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: CARD_GAP
    },
    phoneCarousel: {
        gap: CARD_GAP
    },
    carCard: {
        flexShrink: 0,
        overflow: "hidden",
        borderRadius: 26,
        backgroundColor: COLORS.black,
        borderWidth: 1,
        borderColor: COLORS.gray4
    },
    cardContent: {
        flex: 1,
        justifyContent: "space-between",
        padding: SEPARATOR_SIZES.normal
    },
    carName: {
        color: COLORS.white,
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.p1,
        textShadowColor: "rgba(0, 0, 0, 0.75)",
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 8
    },
    carMake: {
        color: COLORS.white,
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.p2,
        textShadowColor: "rgba(0, 0, 0, 0.75)",
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 8
    },
    carModel: {
        color: COLORS.white,
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p3,
        textShadowColor: "rgba(0, 0, 0, 0.75)",
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 8
    },
    emptyState: {
        alignSelf: "center",
        borderRadius: 26
    }
});

export default React.memo(Garage);
