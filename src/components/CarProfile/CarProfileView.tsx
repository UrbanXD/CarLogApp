import React from "react";
import { CarTableType } from "../../features/Database/connector/powersync/AppSchema.ts";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Image from "../Image.tsx";
import {
    FONT_SIZES,
    GLOBAL_STYLE,
    ICON_FONT_SIZE_SCALE,
    ICON_NAMES,
    SEPARATOR_SIZES
} from "../../constants/constants.ts";
import Button from "../Button/Button.ts";
import { Colors } from "../../constants/colors/index.ts";
import { CAR_FORM_STEPS } from "../../features/Form/layouts/car/steps/useCarSteps.tsx";
import Divider from "../Divider.tsx";
import Odometer from "../Odometer.tsx";
import FuelGauge from "../FuelGauge.tsx";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

interface CarProfileViewProps {
    car: CarTableType
    carImage?: string
    handleDeleteCar?: () => void
    openEditCarStep?: (stepIndex: number, bottomSheetHeight?: string) => void
}

const CarProfileView: React.FC<CarProfileViewProps> = ({
    car,
    carImage,
    handleDeleteCar,
    openEditCarStep
}) =>
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
                            onPress={ () => openEditCarStep(CAR_FORM_STEPS.ImageStep, "72.5%") }
                        />
                    </View>
                </Image>
            </View>
            <View style={ styles.contentRowContainer }>
                <View style={ styles.carInfoRow }>
                    <Text style={ styles.carNameText }>{ car.name }</Text>
                    <Button.Icon
                        icon={ ICON_NAMES.pencil }
                        iconSize={ FONT_SIZES.h3 }
                        iconColor={ Colors.gray1 }
                        width={ FONT_SIZES.h3 }
                        height={ FONT_SIZES.h3 }
                        backgroundColor="transparent"
                        onPress={ () => openEditCarStep(CAR_FORM_STEPS.NameStep, "40%") }
                    />
                </View>
                <Divider
                    color={ Colors.gray3 }
                    margin={ SEPARATOR_SIZES.lightSmall / 2.5 }
                />
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
                <Button.Row style={{ marginTop: SEPARATOR_SIZES.lightSmall, justifyContent: handleDeleteCar ? "space-between" : "center" }}>
                    {
                        handleDeleteCar &&
                        <Button.Icon
                            icon={ ICON_NAMES.trashCan }
                            iconSize={ FONT_SIZES.p2 * ICON_FONT_SIZE_SCALE }
                            backgroundColor={ Colors.googleRed }
                            iconColor={ Colors.black }
                            height={ FONT_SIZES.p2 * 2 }
                            onPress={ handleDeleteCar }
                        />
                    }
                    <Button.Text
                        text="Módosítás"
                        textColor={ Colors.gray1 }
                        fontSize={ FONT_SIZES.p2 }
                        height={ FONT_SIZES.p2 * 2 }
                        backgroundColor="transparent"
                        style={{ flex: 0.75, borderColor: Colors.gray1, borderWidth: 2.5 }}
                        onPress={() => openEditCarStep(CAR_FORM_STEPS.CarModelStep)}
                    />
                </Button.Row>
            </View>
            <Odometer value={ car.odometerValue } measurement={ car.odometerMeasurement } />
            <FuelGauge value={ 232 } tankSize={ car.fuelTankSize } fuelType={ car.fuelType } measurement={ car.fuelMeasurement } />
        </ScrollView>
    </View>

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
        backgroundColor: Colors.black4,
        padding: SEPARATOR_SIZES.small,
        borderRadius: 35
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
});

export default CarProfileView;