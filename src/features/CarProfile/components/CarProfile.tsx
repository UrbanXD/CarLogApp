import React from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { FONT_SIZES, GLOBAL_STYLE, ICON_NAMES, SEPARATOR_SIZES } from "../../../constants/constants";
import { Colors } from "../../../constants/colors";
import Divider from "../../../components/Divider";
import Button from "../../../components/Button/Button";
import useCarProfile from "../hooks/useCarProfile";
import Image from "../../../components/Image";
import { CAR_FORM_STEPS } from "../../Form/layouts/car/steps/useCarSteps";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import Odometer from "../../../components/Odometer.tsx";
import FuelGauge from "../../../components/FuelGauge.tsx";

interface CarInfoProps {
    carID: string
}

const CarProfile: React.FC<CarInfoProps> = ({ carID }) => {
    const {
        car,
        carImage,
        handleDeleteCar,
        openEditForm
    } = useCarProfile(carID);

    return (
        <View style={ styles.container }>
            <ScrollView
                contentContainerStyle={ styles.contentContainer }
                showsVerticalScrollIndicator={ false }
            >
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
                />
                <View style={ styles.contentRowContainer }>
                    <Text style={ styles.carNameText }>{ car.name }</Text>
                    <View style={ styles.carInfoRow }>
                        <Text style={ styles.carInfoTitleText }>Gyártó</Text>
                        <Text style={ styles.carInfoText }>{ car.brand }</Text>
                    </View>
                    <View style={ styles.carInfoRow }>
                        <Text style={ styles.carInfoTitleText }>Model</Text>
                        <Text style={ styles.carInfoText }>{ car.model }</Text>
                    </View>
                    <View style={ styles.carInfoRow }>
                        <Text style={ styles.carInfoTitleText }>Évjárat</Text>
                        <Text style={ styles.carInfoText }>2025</Text>
                    </View>
                </View>
                <View style={ styles.contentRowContainer }>
                    <Text style={ styles.carInfoTitleText }>Kilóméteróra állás ({ car.odometerMeasurement })</Text>
                    <Odometer value={ car.odometerValue } />
                </View>
                <View style={ styles.contentRowContainer }>
                    <FuelGauge value={ 10 } tankSize={ car.fuelTankSize } type={ car.fuelMeasurement } />
                </View>
            </ScrollView>
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
        flexDirection: "column",
        gap: SEPARATOR_SIZES.small,
    },
    contentContainer: {
        ...GLOBAL_STYLE.scrollViewContentContainer, //flexGrow: 1
        gap: SEPARATOR_SIZES.normal
    },
    imageContainer: {
        flexDirection: "row",
        height: hp(25),
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
    },
    contentRowContainer: {
        gap: SEPARATOR_SIZES.lightSmall / 2.5,
    },
    carNameText: {
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.h2,
        letterSpacing: FONT_SIZES.h2 * 0.045,
        color: Colors.white
    },
    carInfoRow: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    carInfoTitleContainer: {
        flexDirection: "row",
        gap: SEPARATOR_SIZES.lightSmall
    },
    carInfoTitleText: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p2,
        letterSpacing: FONT_SIZES.p2 * 0.05,
        color: Colors.gray1,
    },
    carInfoText: {
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.p2,
        letterSpacing: FONT_SIZES.p2 * 0.05,
        color: Colors.gray1
    }
})

export default CarProfile;