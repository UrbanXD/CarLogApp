import React from "react";
import { StyleSheet, View, Text, ImageBackground} from "react-native";
import { FONT_SIZES, ICON_NAMES, SEPARATOR_SIZES } from "../Shared/constants/constants";
import { theme } from "../Shared/constants/theme";
import Divider from "../Shared/components/Divider";
import Button from "../Button/components/Button";
import InformationContainer from "./InformationContainer";
import useCarProfile from "./hooks/useCarProfile";
import Image from "../Image/components/Image";

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
                <View style={ styles.imageContainer }>
                    <Image
                        source={ carImage || "" }
                        alt={ ICON_NAMES.car }
                        overlay
                    >
                        <View style={{ flex: 1, justifyContent: "flex-end", padding: SEPARATOR_SIZES.lightSmall }}>
                            <View style={{ alignSelf: "flex-end" }}>
                                <Button.Icon
                                    icon={ ICON_NAMES.pencil }
                                    iconSize={ FONT_SIZES.medium }
                                    iconColor={ theme.colors.gray1 }
                                    width={ FONT_SIZES.medium }
                                    height={ FONT_SIZES.medium }
                                    backgroundColor={ "transparent" }
                                    onPress={ () => {} }
                                />
                            </View>
                        </View>
                    </Image>
                </View>
                <InformationContainer { ...nameInformationBlock } />
                <InformationContainer { ...carModelInformationBlock } />
                <Divider
                    color={ theme.colors.gray3 }
                    margin={ SEPARATOR_SIZES.small }
                />
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
    },
    content: {
        flex: 1,
        gap: SEPARATOR_SIZES.small,
    },
    imageContainer: {
        flexDirection: "row",
        height: "35%",
        justifyContent: "center",
        gap: SEPARATOR_SIZES.small,
        overflow: "hidden",
    },
    image: {
        width: "80%",
        height: "100%",
        resizeMode: "cover",
        borderRadius: 35,
    },
})

export default CarInfo;