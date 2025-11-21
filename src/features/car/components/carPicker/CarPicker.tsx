import React, { useCallback, useEffect, useRef, useState } from "react";
import { ListRenderItemInfo, StyleSheet, View } from "react-native";
import { FlashList, FlashListRef } from "@shopify/flash-list";
import { COLORS, FONT_SIZES, ICON_FONT_SIZE_SCALE, ICON_NAMES, SEPARATOR_SIZES } from "../../../../constants/index.ts";
import { Car } from "../../schemas/carSchema.ts";
import { useAppDispatch } from "../../../../hooks/index.ts";
import { selectCar } from "../../model/actions/selectCar.ts";
import { CarPickerItem } from "./CarPickerItem.tsx";
import Button from "../../../../components/Button/Button.ts";
import Animated, {
    FadeIn,
    FadeOut,
    interpolate,
    useAnimatedReaction,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from "react-native-reanimated";
import { widthPercentageToDP } from "react-native-responsive-screen";
import { scheduleOnRN } from "react-native-worklets";
import { AnimatedPressable } from "../../../../components/AnimatedComponents/index.ts";
import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import { router } from "expo-router";
import useCars from "../../hooks/useCars.ts";
import { SelectedCar } from "./SelectedCar.tsx";
import { useTranslation } from "react-i18next";

const CLOSE_ICON_SIZE = FONT_SIZES.p2 * ICON_FONT_SIZE_SCALE;
const MAX_TRANSLATE = widthPercentageToDP(100);

type CarPickerProps = {
    onCarListVisibleChange?: (visible: boolean) => void
}

export function CarPicker({ onCarListVisibleChange }: CarPickerProps) {
    const { t } = useTranslation();
    const database = useDatabase();
    const { cars, selectedCar } = useCars();
    const dispatch = useAppDispatch();

    const flashListRef = useRef<FlashListRef<Car>>(null);

    const [carListVisible, setCarListVisible] = useState(false);
    const isCarsListVisible = useSharedValue(false);

    useEffect(() => {
        if(!carListVisible) return;

        let selectedIndex = cars.findIndex(car => car.id === selectedCar?.id);
        if(selectedIndex === -1) selectedIndex = 0;

        flashListRef.current.scrollToIndex({ index: selectedIndex, animated: true, viewPosition: 0 });
    }, [selectedCar, carListVisible]);

    const delayCarListVisibleState = (visible: boolean) => {
        setTimeout(() => {
            setCarListVisible(visible);
            onCarListVisibleChange(visible);
        }, visible ? 0 : 250); // delay for smooth exiting animation of close icon and car list
    };

    useAnimatedReaction(
        () => isCarsListVisible.value,
        (visible) => scheduleOnRN(delayCarListVisibleState, visible)
    );

    const select = useCallback((carId: string) => dispatch(selectCar({ database, carId })), []);
    const closeList = useCallback(() => isCarsListVisible.value = false, []);
    const openList = useCallback(() => isCarsListVisible.value = true, []);
    const openCreateCarBottomSheet = useCallback(() => router.push("bottomSheet/createCar"), []);

    const renderItem = ({ item }: ListRenderItemInfo<Car>) =>
        <CarPickerItem
            key={ item.id }
            name={ item.name }
            model={ `${ item.model.make.name } ${ item.model.name }` }
            selected={ item.id === selectedCar?.id }
            onPress={ () => select(item.id) }
        />;

    const renderSeparatorComponent = useCallback(
        () => <View style={ { width: SEPARATOR_SIZES.lightSmall } }/>,
        []
    );

    const keyExtractor = (item: Car) => item.id;

    const carPickerStyle = useAnimatedStyle(() => {
        const opacity = withTiming(Number(isCarsListVisible.value), { duration: 650 });
        const translateX = withTiming(
            interpolate(Number(isCarsListVisible.value), [0, 1], [MAX_TRANSLATE, 0]),
            { duration: 650 }
        );

        return { opacity, transform: [{ translateX }], width: "100%", paddingRight: CLOSE_ICON_SIZE * 1.5 };
    });

    const closeIconStyle = useAnimatedStyle(() => {
        const opacity = withTiming(Number(isCarsListVisible.value), { duration: 550 });
        const translateX = withTiming(
            interpolate(Number(isCarsListVisible.value), [0, 1], [-CLOSE_ICON_SIZE, 0]),
            { duration: 550 }
        );

        return { opacity, transform: [{ translateX }] };
    });

    return (
        <View style={ styles.container }>
            {
                !carListVisible &&
               <AnimatedPressable
                  entering={ FadeIn.duration(250) }
                  exiting={ FadeOut.duration(250) }
                  onPress={ cars.length === 0 ? openCreateCarBottomSheet : openList }
                  style={ styles.controllerContainer }
               >
                  <SelectedCar
                     car={ selectedCar }
                     placeholder={ t("car.picker.placeholder") }
                     userDontHaveCars={ cars.length === 0 }
                     userDontHaveCarsPlaceholder={ t("car.picker.no_cars") }
                  />
               </AnimatedPressable>
            }
            <Animated.View style={ [styles.closeIconContainer, closeIconStyle] }>
                <Button.Icon
                    icon={ ICON_NAMES.close }
                    iconSize={ CLOSE_ICON_SIZE }
                    iconColor={ COLORS.white }
                    backgroundColor="transparent"
                    style={ styles.closeIconContainer.icon }
                    onPress={ closeList }
                />
            </Animated.View>
            <Animated.View style={ carPickerStyle }>
                <FlashList
                    ref={ flashListRef }
                    data={ cars }
                    renderItem={ renderItem }
                    keyExtractor={ keyExtractor }
                    ItemSeparatorComponent={ renderSeparatorComponent }
                    contentContainerStyle={ { flexGrow: 1 } }
                    horizontal
                    showsHorizontalScrollIndicator={ false }
                />
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        overflow: "hidden",
        gap: SEPARATOR_SIZES.lightSmall
    },
    textContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",

        name: {
            fontFamily: "Gilroy-Heavy",
            fontSize: FONT_SIZES.p3,
            letterSpacing: FONT_SIZES.p3 * 0.05,
            color: COLORS.white
        },

        model: {
            fontFamily: "Gilroy-Medium",
            fontSize: FONT_SIZES.p3 * 0.9,
            letterSpacing: FONT_SIZES.p3 * 0.9 * 0.05,
            color: COLORS.gray1
        }
    },
    closeIconContainer: {
        alignItems: "center",
        justifyContent: "center",

        icon: {
            width: CLOSE_ICON_SIZE,
            height: CLOSE_ICON_SIZE,
            alignSelf: "center"
        }
    },
    controllerContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: SEPARATOR_SIZES.lightSmall
    }
});