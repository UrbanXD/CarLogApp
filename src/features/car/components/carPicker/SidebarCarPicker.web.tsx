import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import Icon from "../../../../components/Icon";
import { COLORS, ICON_NAMES } from "../../../../constants";
import { useAppDispatch, useAppSelector } from "../../../../hooks";
import { selectCar } from "../../model/actions/selectCar";
import { getSelectedCarId } from "../../model/selectors/getSelectedCarId";
import useCars from "../../hooks/useCars";
import { useCar } from "../../hooks/useCar";
import { WEB_SCROLLBAR_STYLE } from "../../../../components/screenView/webScrollbarStyle";

export default function SidebarCarPicker() {
    const { t } = useTranslation();
    const { cars, isLoading } = useCars();
    const selectedCarId = useAppSelector(getSelectedCarId);
    const { car } = useCar({ carId: selectedCarId });
    const dispatch = useAppDispatch();
    const [open, setOpen] = useState(false);

    const toggle = () => {
        if(cars.length === 0 && !isLoading) {
            router.push("/car/create");
            return;
        }
        setOpen(value => !value);
    };

    return (
        <View style={ styles.container }>
            <Text style={ styles.label }>{ t("navigation.vehicle") }</Text>
            <Pressable onPress={ toggle } style={ [styles.selected, open && styles.selectedOpen] }>
                <Icon icon={ ICON_NAMES.car } size={ 21 } color={ COLORS.fuelYellow }/>
                <View style={ styles.selectedText }>
                    <Text style={ styles.name }>{ car?.name ?? (isLoading ? t("garage.loading") : t(
                        "car.picker.placeholder")) }</Text>
                    { car && <Text style={ styles.model }>{ car.model.make.name } { car.model.name }</Text> }
                </View>
                <Icon icon={ open ? ICON_NAMES.upArrowHead : ICON_NAMES.downArrowHead } size={ 18 }
                      color={ COLORS.gray1 }/>
            </Pressable>
            { open && (
                <>
                    <Pressable style={ styles.dismissLayer } onPress={ () => setOpen(false) }/>
                    <View style={ styles.menu }>
                        <ScrollView
                            style={ [styles.list, WEB_SCROLLBAR_STYLE] }
                            showsVerticalScrollIndicator
                            keyboardShouldPersistTaps="handled"
                        >
                            { cars.map(item => {
                                const selected = item.id === selectedCarId;
                                return (
                                    <Pressable
                                        key={ item.id }
                                        onPress={ () => {
                                            dispatch(selectCar(item.id));
                                            setOpen(false);
                                        } }
                                        style={ [styles.option, selected && styles.optionSelected] }
                                    >
                                        <View style={ styles.optionText }>
                                            <Text style={ styles.name }>{ item.name }</Text>
                                            <Text
                                                style={ styles.model }>{ item.model.make.name } { item.model.name }</Text>
                                        </View>
                                        { selected && <Icon icon={ ICON_NAMES.check } size={ 18 }
                                                            color={ COLORS.fuelYellow }/> }
                                    </Pressable>
                                );
                            }) }
                        </ScrollView>
                        <Pressable style={ styles.addCar } onPress={ () => {
                            setOpen(false);
                            router.push("/car/create");
                        } }>
                            <Icon icon={ ICON_NAMES.add } size={ 18 } color={ COLORS.fuelYellow }/>
                            <Text style={ styles.addCarText }>{ t("garage.add_new_car") }</Text>
                        </Pressable>
                    </View>
                </>
            ) }
        </View>
    );
}

const styles = StyleSheet.create({
    container: { position: "relative", zIndex: 40, marginBottom: 28 },
    label: {
        marginBottom: 9,
        paddingHorizontal: 11,
        color: COLORS.gray2,
        fontFamily: "Gilroy-Heavy",
        fontSize: 14,
        letterSpacing: 1.4
    },
    selected: {
        minHeight: 64,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingHorizontal: 11,
        paddingVertical: 9,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#37383A",
        backgroundColor: "#202122"
    },
    selectedOpen: { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
    selectedText: { flex: 1, minWidth: 0, gap: 3 },
    name: { color: COLORS.white, fontFamily: "Gilroy-Heavy", fontSize: 18.75, lineHeight: 23 },
    model: { color: COLORS.gray2, fontFamily: "Gilroy-Medium", fontSize: 15.625 },
    dismissLayer: { ...StyleSheet.absoluteFillObject, zIndex: 1 },
    menu: {
        position: "absolute",
        top: "100%",
        left: 0,
        right: 0,
        zIndex: 2,
        overflow: "hidden",
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 13,
        borderBottomRightRadius: 13,
        borderWidth: 1,
        borderColor: COLORS.gray4,
        backgroundColor: "#202122",
        shadowColor: COLORS.black,
        shadowOpacity: 0.4,
        shadowRadius: 18,
        elevation: 12
    },
    list: { maxHeight: 270 },
    option: {
        minHeight: 60,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 10
    },
    optionSelected: { backgroundColor: "#29291D" },
    optionText: { flex: 1, minWidth: 0, gap: 3 },
    addCar: {
        minHeight: 48,
        flexDirection: "row",
        alignItems: "center",
        gap: 9,
        paddingHorizontal: 12,
        borderTopWidth: 1,
        borderTopColor: COLORS.gray4
    },
    addCarText: { color: COLORS.fuelYellow, fontFamily: "Gilroy-Heavy", fontSize: 17.5 }
});
