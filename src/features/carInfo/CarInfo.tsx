import React, {useState} from "react";
import {Image, StyleSheet, View, Text, ImageBackground} from "react-native";
import {addCar} from "../Database/redux/cars/functions/addCar";
import {CarTableType} from "../Database/connector/powersync/AppSchema";
import {useDatabase} from "../Database/connector/Database";
import {formatImageSource} from "../Shared/utils/formatImageSource";
import DefaultElement from "../Shared/components/DefaultElement";
import { FONT_SIZES, ICON_NAMES, SEPARATOR_SIZES } from "../Shared/constants/constants";
import Icon from "../Shared/components/Icon";
import { theme } from "../Shared/constants/theme";
import Divider from "../Shared/components/Divider";
import Button from "../Button/components/Button";
import InformationContainer from "./InformationContainer";
import useCarProfile from "./hooks/useCarProfile";
import {useBottomSheet} from "../BottomSheet/context/BottomSheetProvider";

interface CarInfoProps {
    carID: string
}

const CarInfo: React.FC<CarInfoProps> = ({ carID }) => {
    const {
        carImage,
        handleDeleteCar,
        nameInformationBlock,
        carModelInformationBlock
    } = useCarProfile(carID);

    return (
        <View style={ styles.container }>
            <View style={ styles.content }>
                {
                    carImage
                        ?   <Image
                                source={ formatImageSource(carImage) }
                                style={ styles.image }
                            />
                        :   <DefaultElement
                                icon={ ICON_NAMES.image }
                                style={ styles.image }
                            />
                }
                <InformationContainer { ...nameInformationBlock } />
                <InformationContainer { ...carModelInformationBlock } />
                <Divider color={ theme.colors.gray3 } />
                <View>
                    <Icon icon={ ICON_NAMES.pencil } color={ theme.colors.white } />
                </View>
            </View>
            <Button.Row>
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
            </Button.Row>
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