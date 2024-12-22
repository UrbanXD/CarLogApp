import React from "react";
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

interface CarInfoProps {
    car?: CarTableType
}

const CarInfo: React.FC<CarInfoProps> = ({ car }) => {
    return (
        <View style={ styles.container }>
            <View style={ styles.content }>
                {
                    car?.image
                        ?   <ImageBackground
                                source={ formatImageSource(car?.image) }
                                style={ styles.itemContentContainer }
                                imageStyle={ styles.itemImage }
                            />
                        :   <DefaultImage />
                }
                <View>
                    <Text style={ styles.carInfoText } numberOfLines={ 3 }>
                        { car?.brand } { car?.model }
                    </Text>
                    <Text style={ styles.carDateText } numberOfLines={ 3 }>
                        2018
                    </Text>
                    <View style={{ position: "absolute", alignItems: "flex-end", justifyContent:"center", width:"100%" }}>
                        <Icon icon={ ICON_NAMES.pencil } color={ theme.colors.white } />
                    </View>
                </View>
                <Divider color={ theme.colors.gray2 } />
                <View>
                    <Icon icon={ ICON_NAMES.pencil } color={ theme.colors.white } />
                </View>
            </View>
            <Button.Text
                onPress={() => {}}
                text="Törlés"
                backgroundColor={ theme.colors.googleRed }
                textColor={ theme.colors.black }
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