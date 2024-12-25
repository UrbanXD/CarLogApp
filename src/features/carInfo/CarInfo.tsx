import React, {useState} from "react";
import {Image, StyleSheet, View, Text, ImageBackground} from "react-native";
import { theme } from "../core/constants/theme";
import { FONT_SIZES, ICON_COLORS, ICON_NAMES, SEPARATOR_SIZES } from "../core/constants/constants";
import {CarTableType} from "../core/utils/database/powersync/AppSchema";
import Icon from "../core/components/shared/Icon";
import Divider from "../core/components/shared/Divider";
import IconButton from "../core/components/shared/button/IconButton";
import Button from "../core/components/shared/button/Button";
import {formatImageSource} from "../core/utils/formatImageSource";
import DefaultImage from "../core/components/shared/DefaultImage";
import {useBottomSheet} from "../core/context/BottomSheetProvider";
import NewCarForm from "../layouts/forms/addCar/NewCarForm";
import TextInput from "../core/components/input/text/TextInput";
import {deleteCar} from "../core/redux/cars/functions/deleteCar";
import {useDatabase} from "../core/utils/database/Database";
import {store} from "../core/redux/store";
import {addCar} from "../core/redux/cars/functions/addCar";

interface CarInfoProps {
    car: CarTableType
}

const CarInfo: React.FC<CarInfoProps> = ({ car }) => {
    const database = useDatabase();

    return (
        <View style={ styles.container }>
            <View style={ styles.content }>
                {
                    car?.image
                        ?   <Image
                                source={ formatImageSource(car?.image) }
                                style={ styles.image }
                            />
                        :   <DefaultImage style={ styles.image }/>
                }
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={ styles.carInfoText } numberOfLines={ 3 }>
                            { car?.brand } { car?.model }
                        </Text>
                        <Text style={ styles.carDateText } numberOfLines={ 3 }>
                            2018
                        </Text>
                    </View>
                    <View style={{ alignItems: "flex-end", justifyContent:"center" }}>
                        <Icon icon={ ICON_NAMES.pencil } color={ theme.colors.white } />
                    </View>
                </View>
                <Divider color={ theme.colors.gray2 } />
                <View>
                    <Icon icon={ ICON_NAMES.pencil } color={ theme.colors.white } />
                </View>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Button.Icon
                    icon={ ICON_NAMES.trashCan }
                    backgroundColor={ theme.colors.googleRed }
                    iconColor={ theme.colors.black }
                    onPress={ () => store.dispatch(deleteCar({database, carID: car.id})) }
                />
                <Button.Text
                    onPress={() => {}}
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
        marginTop: SEPARATOR_SIZES.small,
        gap: SEPARATOR_SIZES.small,
        paddingBottom: SEPARATOR_SIZES.normal,
    },
    content: {
        flex: 1,
        gap: SEPARATOR_SIZES.small,
    },
    image: {
        flex: 0,
        height: "30%",
        width: "100%",
        resizeMode: "stretch",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: theme.colors.gray3
    },
    itemContentContainer: {
        flex: 1,
        borderWidth: 0.5,
        borderRadius: 38,
        borderColor: theme.colors.gray3
    },
    itemImage: {
        width: "100%",
        resizeMode: "stretch",
        borderRadius: 35,
    },
    carInfoText: {
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.normal,
        letterSpacing: FONT_SIZES.normal * 0.045,
        color: theme.colors.white,
        textTransform: "uppercase",
    },
    carDateText: {
        fontFamily: "Gilroy",
        fontSize: FONT_SIZES.small,
        letterSpacing: FONT_SIZES.small * 0.045,
        color: theme.colors.white,
    }
})

export default CarInfo;