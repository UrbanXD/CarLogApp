import React, {useState} from "react";
import {Image, StyleSheet, View, Text, ImageBackground} from "react-native";
import {addCar} from "../Database/redux/cars/functions/addCar";
import {CarTableType} from "../Database/connector/powersync/AppSchema";
import {useDatabase} from "../Database/connector/Database";
import {formatImageSource} from "../Shared/utils/formatImageSource";
import DefaultElement from "../Shared/components/DefaultElement";
import {FONT_SIZES, ICON_NAMES, SEPARATOR_SIZES} from "../Shared/constants/constants";
import Icon from "../Shared/components/Icon";
import {theme} from "../Shared/constants/theme";
import Divider from "../Shared/components/Divider";
import Button from "../Button/components/Button";
import {deleteCar} from "../Database/redux/cars/functions/deleteCar";
import {store} from "../Database/redux/store";
import {OpenBottomSheetArgs, useBottomSheet} from "../BottomSheet/context/BottomSheetProvider";
import {useAlert} from "../Alert/context/AlertProvider";
import {router} from "expo-router";
import EditCarForm from "../Form/layouts/car/editCar/EditCarForm";

interface CarInfoProps {
    car: CarTableType
    openBottomSheet: (args: OpenBottomSheetArgs) => void
    forceCloseBottomSheet: () => void
}

const CarInfo: React.FC<CarInfoProps> = ({
    car,
    openBottomSheet,
    forceCloseBottomSheet
}) => {
    const database = useDatabase();
    const { openModal } = useAlert();

    const openEditBottomSheet = (index: number) => {
        openBottomSheet({
            content:
                <EditCarForm
                    car={ car }
                    stepIndex={ index }
                    forceCloseBottomSheet={ forceCloseBottomSheet }
                />,
            snapPoints: ["37.5%"]
        })
    }

    const handleDeleteCar = () => {
        openModal({
            title: `A(z) ${car.name} nevű autó törlése`,
            body: `Az autó kitörlése egy visszafordithatatlan folyamat, gondolja meg jól, hogy folytatja-e a műveletet`,
            acceptText: "Törlés",
            accept: () => {
                // store.dispatch(deleteCar({ database, carID: car.id }));
            },
        })
    }

    return (
        <View style={ styles.container }>
            <View style={ styles.content }>
                {
                    car?.image
                        ?   <Image
                                source={ formatImageSource(car?.image) }
                                style={ styles.image }
                            />
                        :   <DefaultElement icon={ ICON_NAMES.image } style={ styles.image }/>
                }
                <View style={ styles.columnContainer }>
                    <View style={ styles.rowContainer }>
                        <View style={ styles.columnTitleContainer }>
                            <Icon
                                icon={ ICON_NAMES.nametag }
                                size={ FONT_SIZES.medium }
                                color={ theme.colors.gray2 }
                            />
                            <Text
                                style={ styles.carTitleText }
                                numberOfLines={ 2 }
                            >
                                { car?.name }
                            </Text>
                        </View>
                    </View>
                    <View style={ styles.columnEditIconContainer }>
                        <Button.Icon
                            icon={ ICON_NAMES.pencil }
                            iconSize={ FONT_SIZES.medium }
                            iconColor={ theme.colors.gray1 }
                            width={ FONT_SIZES.medium }
                            backgroundColor={ "transparent" }
                            onPress={ () => openEditBottomSheet(0) }
                        />
                    </View>
                </View>
                {/*<Divider color={ theme.colors.gray3 } />*/}
                <View style={ styles.columnContainer }>
                    <View style={ styles.rowContainer }>
                        <View style={ styles.columnTitleContainer }>
                            <Icon
                                icon={ ICON_NAMES.car }
                                size={ FONT_SIZES.medium }
                                color={ theme.colors.gray2 }
                            />
                            <Text style={ styles.carInfoText } numberOfLines={ 3 }>
                                { car?.brand } { car?.model }
                            </Text>
                        </View>
                        <View style={ styles.columnTitleContainer }>
                            <Icon
                                icon={ ICON_NAMES.calendar }
                                size={ FONT_SIZES.medium }
                                color={ theme.colors.gray2 }
                            />
                            <Text
                                style={ styles.carInfoText }
                                numberOfLines={ 3 }
                            >
                                2018
                            </Text>
                        </View>
                    </View>
                    <View style={ styles.columnEditIconContainer }>
                        <Button.Icon
                            icon={ ICON_NAMES.pencil }
                            iconSize={ FONT_SIZES.medium }
                            iconColor={ theme.colors.gray1 }
                            width={ FONT_SIZES.medium }
                            backgroundColor={ "transparent" }
                            onPress={ () =>{} }
                        />
                    </View>
                </View>
                <Divider color={ theme.colors.gray3 } />
                <View>
                    <Icon icon={ ICON_NAMES.pencil } color={ theme.colors.white } />
                </View>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Button.Icon
                    icon={ ICON_NAMES.trashCan }
                    backgroundColor={ theme.colors.googleRed }
                    iconColor={ theme.colors.black }
                    onPress={ handleDeleteCar }
                />
                <Button.Text
                    onPress={ () => {} }
                    text="Módosítás"
                    style={{ flex: 0.9 }}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: SEPARATOR_SIZES.small,
        paddingBottom: SEPARATOR_SIZES.normal,
    },
    content: {
        flex: 1,
        gap: SEPARATOR_SIZES.small,
    },
    image: {
        // flex: 0,
        height: "35%",
        width: "100%",
        resizeMode: "cover",
        borderRadius: 35,
    },
    columnContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: theme.colors.gray5,
        padding: SEPARATOR_SIZES.lightSmall,
        borderRadius: 15
    },
    rowContainer: {
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        gap: SEPARATOR_SIZES.lightSmall
    },
    columnTitleContainer: {
        flexGrow: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: SEPARATOR_SIZES.lightSmall
    },
    columnEditIconContainer: {
        alignItems: "flex-end",
        justifyContent: "center"
    },
    carTitleText: {
        flexShrink: 1,
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.intermediate,
        letterSpacing: FONT_SIZES.intermediate * 0.045,
        color: theme.colors.white,
        textTransform: "uppercase",
    },
    carInfoText: {
        flexShrink: 1,
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.intermediate,
        letterSpacing: FONT_SIZES.intermediate * 0.045,
        color: theme.colors.gray1,
    },
})

export default CarInfo;