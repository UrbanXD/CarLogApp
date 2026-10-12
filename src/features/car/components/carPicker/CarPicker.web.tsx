import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, useWindowDimensions, View } from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { COLORS, FONT_SIZES, ICON_NAMES, SEPARATOR_SIZES } from "../../../../constants";
import Button from "../../../../components/Button/Button";
import { MoreDataLoading } from "../../../../components/loading/MoreDataLoading";
import { useAppDispatch, useAppSelector } from "../../../../hooks";
import { selectCar } from "../../model/actions/selectCar";
import { getSelectedCarId } from "../../model/selectors/getSelectedCarId";
import useCars from "../../hooks/useCars";
import { useCar } from "../../hooks/useCar";
import { CarPickerItem } from "./CarPickerItem";
import { WEB_SCROLLBAR_STYLE } from "../../../../components/screenView/webScrollbarStyle";

type CarPickerProps = {
    onCarListVisibleChange?: (visible: boolean) => void
}

export function CarPicker({ onCarListVisibleChange }: CarPickerProps) {
    const { t } = useTranslation();
    const { width } = useWindowDimensions();
    const showScrollbar = width >= 1040;
    const { cars, isLoading } = useCars();
    const selectedCarId = useAppSelector(getSelectedCarId);
    const { car: selectedCar } = useCar({ carId: selectedCarId });
    const dispatch = useAppDispatch();
    const [isListVisible, setIsListVisible] = useState(false);

    useEffect(() => onCarListVisibleChange?.(isListVisible), [isListVisible, onCarListVisibleChange]);

    const openList = () => {
        if(cars.length === 0) {
            router.push("car/create");
            return;
        }
        setIsListVisible(true);
    };

    const chooseCar = (carId: string) => {
        dispatch(selectCar(carId));
        setIsListVisible(false);
    };

    return (
        <View style={ styles.container }>
            {
                !isListVisible
                ? <Button.Text
                    text={ selectedCar
                           ? `${ selectedCar.name } · ${ selectedCar.model.make.name } ${ selectedCar.model.name }`
                           : isLoading ? t("garage.loading") : t("car.picker.placeholder") }
                    textColor={ COLORS.white }
                    backgroundColor="transparent"
                    textStyle={ styles.selectedCarText }
                    style={ styles.selectedCarButton }
                    onPress={ openList }
                />
                : <>
                    {
                        isLoading
                        ? <MoreDataLoading withText={ false } containerStyle={ { flex: 1 } }/>
                        : <ScrollView
                            style={ showScrollbar ? WEB_SCROLLBAR_STYLE : undefined }
                            horizontal
                            showsHorizontalScrollIndicator={ showScrollbar }
                            contentContainerStyle={ styles.listContent }
                        >
                            { cars.map((car) => (
                                <CarPickerItem
                                    key={ car.id }
                                    name={ car.name }
                                    model={ `${ car.model.make.name } ${ car.model.name }` }
                                    selected={ car.id === selectedCar?.id }
                                    onPress={ () => chooseCar(car.id) }
                                />
                            )) }
                        </ScrollView>
                    }
                    <Button.Icon
                        icon={ ICON_NAMES.close }
                        iconSize={ FONT_SIZES.p2 }
                        iconColor={ COLORS.white }
                        backgroundColor="transparent"
                        onPress={ () => setIsListVisible(false) }
                    />
                </>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        minWidth: 0,
        flexDirection: "row",
        alignItems: "center",
        gap: SEPARATOR_SIZES.lightSmall
    },
    selectedCarButton: {
        alignSelf: "stretch",
        justifyContent: "flex-start",
        width: "100%",
        minWidth: 0,
        paddingHorizontal: SEPARATOR_SIZES.small
    },
    selectedCarText: {
        textAlign: "left",
        fontSize: FONT_SIZES.p3
    },
    listContent: {
        alignItems: "center",
        gap: SEPARATOR_SIZES.lightSmall,
        paddingRight: SEPARATOR_SIZES.lightSmall
    }
});
