import React from "react";
import { Image, StyleSheet, View, Text } from "react-native";
import { theme } from "../core/constants/theme";
import { FONT_SIZES, ICON_COLORS, ICON_NAMES, SEPARATOR_SIZES } from "../core/constants/constants";
import {CarTableType} from "../core/utils/database/powersync/AppSchema";
import Icon from "../core/components/shared/Icon";
import Divider from "../core/components/shared/Divider";
import IconButton from "../core/components/shared/button/IconButton";
import Button from "../core/components/shared/button/Button";

interface CarInfoProps {
    car?: CarTableType
}

const CarInfo: React.FC<CarInfoProps> = ({ car }) => {
    return (
        <View style={ styles.container }>
            <View style={ styles.content }>
                <Image
                    source={ car?.image || require("../../assets/images/car1.jpg") }
                    style={ styles.image }
                />
                <View>
                    <Text style={ styles.carInfoText } numberOfLines={ 3 }>
                        { car?.brand } { car?.model }
                    </Text>
                    <Text style={ styles.carDateText } numberOfLines={ 3 }>
                        2018
                    </Text>
                    <View style={{ position: "absolute", alignItems: "flex-end", width:"100%" }}>
                        <Icon icon={ ICON_NAMES.pencil } color={ theme.colors.white } />
                    </View>
                </View>
                <Divider />
                <View>
                    <Icon icon={ ICON_NAMES.pencil } color={ theme.colors.white } />
                </View>
            </View>
            <Button.Text
                onPress={() => {}}
                text="Törlés"
                backgroundColor={ theme.colors.googleRed }
                textColor={ theme.colors.black2 }
            />
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
        height: "30%",
        width: "100%",
        resizeMode: "cover",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: theme.colors.gray3
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