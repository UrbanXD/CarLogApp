import React from "react";
import { StyleSheet, View } from "react-native";
 import { FONT_SIZES, ICON_NAMES, SEPARATOR_SIZES } from "../../../constants/constants";
import { Colors } from "../../../constants/colors";
import Divider from "../../../components/Divider";
import Button from "../../../components/Button/Button";
import InformationContainer from "./InformationContainer";
import useCarProfile from "../hooks/useCarProfile";
import Image from "../../../components/Image";
import { CAR_FORM_STEPS } from "../../Form/layouts/car/steps/useCarSteps";
import { widthPercentageToDP as wp} from "react-native-responsive-screen";

interface CarInfoProps {
    carID: string
}

const CarProfile: React.FC<CarInfoProps> = ({ carID }) => {
    const {
        carImage,
        handleDeleteCar,
        nameInformationBlock,
        carModelInformationBlock,
        odometerInformationBlock,
        fuelInformationBlock,
        openEditForm
    } = useCarProfile(carID);

    return (
        <View style={ styles.container }>
            <View style={ styles.content }>
                <View style={ styles.imageContainer }>
                    <Image
                        source={ carImage }
                        alt={ ICON_NAMES.car }
                        overlay
                    >
                        <View style={ styles.editImageIconContainer }>
                                <Button.Icon
                                    icon={ ICON_NAMES.pencil }
                                    iconSize={ FONT_SIZES.h2 }
                                    iconColor={ Colors.gray1 }
                                    width={ FONT_SIZES.h2 }
                                    height={ FONT_SIZES.h2 }
                                    style={ styles.editImageIcon }
                                    backgroundColor="transparent"
                                    onPress={ () => openEditForm(CAR_FORM_STEPS.ImageStep, "70%") }
                                />
                        </View>
                    </Image>
                </View>
                <Divider
                    size={ wp(80) }
                    color={ Colors.gray3 }
                    margin={ SEPARATOR_SIZES.small }
                />
                <InformationContainer { ...nameInformationBlock } />
                <InformationContainer { ...carModelInformationBlock } />
                <InformationContainer { ...odometerInformationBlock } />
                <InformationContainer { ...fuelInformationBlock } />
            </View>
            <Button.Row>
                <Button.Icon
                    icon={ ICON_NAMES.trashCan }
                    backgroundColor={ Colors.googleRed }
                    iconColor={ Colors.black }
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
    editImageIconContainer: {
        flex: 1,
        justifyContent: "flex-end",
        padding: SEPARATOR_SIZES.lightSmall,
    },
    editImageIcon: {
        alignSelf: "flex-end"
    }
})

export default CarProfile;