import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Image from "../../../../components/Image.tsx";
import { COLORS, FONT_SIZES, ICON_FONT_SIZE_SCALE, ICON_NAMES, SEPARATOR_SIZES } from "../../../../constants/index.ts";
import Button from "../../../../components/Button/Button.ts";
import { CAR_FORM_STEPS } from "../../constants/index.ts";
import Divider from "../../../../components/Divider.tsx";
import { Odometer } from "../../_features/odometer/components/Odometer.tsx";
import FuelGauge from "../../_features/fuel/components/FuelGauge.tsx";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Car } from "../../schemas/carSchema.ts";
import { IntelligentMarquee } from "../../../../components/marquee/IntelligentMarquee.tsx";
import Link from "../../../../components/Link.tsx";

type CarProfileViewProps = {
    car: Car
    openEditCarStep: (stepIndex: number) => void
    fuelSliderDisabled?: boolean
    handleDeleteCar?: () => void
    openOdometerLog?: () => void
}

const MARQUEE_SPEED = 0.75;
const MARQUEE_DELAY = 500;
const MARQUEE_BOUNCE_DELAY = 500;

function CarProfileView({
    car,
    openEditCarStep,
    fuelSliderDisabled = false,
    handleDeleteCar,
    openOdometerLog
}: CarProfileViewProps) {
    return (
        <View style={ styles.container }>
            <View style={ styles.imageContainer }>
                <Image
                    source={ car.image?.image }
                    alt={ ICON_NAMES.car }
                    overlay
                >
                    <View style={ styles.editImageIconContainer }>
                        <Button.Icon
                            icon={ ICON_NAMES.pencil }
                            iconSize={ FONT_SIZES.h2 }
                            iconColor={ COLORS.gray1 }
                            width={ FONT_SIZES.h2 }
                            height={ FONT_SIZES.h2 }
                            style={ styles.editImageIcon }
                            backgroundColor="transparent"
                            onPress={ () => openEditCarStep(CAR_FORM_STEPS.ImageStep) }
                        />
                    </View>
                </Image>
            </View>
            <View style={ styles.contentRowContainer }>
                <View style={ styles.carInfoRow }>
                    <View style={ { flex: 1 } }>
                        <IntelligentMarquee
                            speed={ MARQUEE_SPEED }
                            bounceDelay={ MARQUEE_BOUNCE_DELAY }
                            delay={ MARQUEE_DELAY }
                            spacing={ SEPARATOR_SIZES.medium }
                        >
                            <Text style={ styles.carNameText }>{ car.name }</Text>
                        </IntelligentMarquee>
                    </View>
                    <Button.Icon
                        icon={ ICON_NAMES.pencil }
                        iconSize={ FONT_SIZES.h3 }
                        iconColor={ COLORS.gray1 }
                        width={ FONT_SIZES.h3 }
                        height={ FONT_SIZES.h3 }
                        backgroundColor="transparent"
                        onPress={ () => openEditCarStep(CAR_FORM_STEPS.NameStep) }
                    />
                </View>
                <Divider
                    color={ COLORS.gray3 }
                    margin={ SEPARATOR_SIZES.lightSmall / 2.5 }
                />
                <View style={ styles.carInfoRow }>
                    <Text style={ styles.carInfoRow.title }>Gyártó</Text>
                    <View style={ styles.carInfoRow.infoContainer }>
                        <IntelligentMarquee
                            speed={ MARQUEE_SPEED }
                            bounceDelay={ MARQUEE_BOUNCE_DELAY }
                            delay={ MARQUEE_DELAY }
                            spacing={ SEPARATOR_SIZES.medium }
                            style={ { alignSelf: "flex-end" } }
                        >
                            <Text style={ styles.carInfoRow.infoContainer.text }>{ car.model.make.name }</Text>
                        </IntelligentMarquee>
                    </View>
                </View>
                <View style={ styles.carInfoRow }>
                    <Text style={ styles.carInfoRow.title }>Model</Text>
                    <View style={ styles.carInfoRow.infoContainer }>
                        <IntelligentMarquee
                            speed={ 0.75 }
                            bounceDelay={ 500 }
                            delay={ 500 }
                            spacing={ SEPARATOR_SIZES.medium }
                            style={ { alignSelf: "flex-end" } }
                        >
                            <Text style={ styles.carInfoRow.infoContainer.text }>{ car.model.name }</Text>
                        </IntelligentMarquee>
                    </View>
                </View>
                <View style={ styles.carInfoRow }>
                    <Text style={ styles.carInfoRow.title }>Évjárat</Text>
                    <View style={ styles.carInfoRow.infoContainer }>
                        <IntelligentMarquee
                            speed={ MARQUEE_SPEED }
                            bounceDelay={ MARQUEE_BOUNCE_DELAY }
                            delay={ MARQUEE_DELAY }
                            spacing={ SEPARATOR_SIZES.medium }
                            style={ { alignSelf: "flex-end" } }
                        >
                            <Text
                                style={ styles.carInfoRow.infoContainer.text }>{ car.model.year }</Text>
                        </IntelligentMarquee>
                    </View>
                </View>
                <Button.Row style={ {
                    marginTop: SEPARATOR_SIZES.mediumSmall,
                    justifyContent: handleDeleteCar ? "space-between" : "center"
                } }>
                    {
                        handleDeleteCar &&
                       <Button.Icon
                          icon={ ICON_NAMES.trashCan }
                          iconSize={ FONT_SIZES.p2 * ICON_FONT_SIZE_SCALE }
                          backgroundColor={ COLORS.googleRed }
                          iconColor={ COLORS.black }
                          height={ FONT_SIZES.p2 * 2 }
                          onPress={ handleDeleteCar }
                       />
                    }
                    <Button.Text
                        text="Módosítás"
                        textColor={ COLORS.gray1 }
                        fontSize={ FONT_SIZES.p2 }
                        height={ FONT_SIZES.p2 * 2 }
                        backgroundColor="transparent"
                        style={ { flex: 0.75, borderColor: COLORS.gray1, borderWidth: 2.5 } }
                        onPress={ () => openEditCarStep(CAR_FORM_STEPS.CarModelStep) }
                    />
                </Button.Row>
            </View>
            <View style={ { gap: SEPARATOR_SIZES.lightSmall } }>
                <View style={ styles.odometerContainer }>
                    <Text style={ styles.odometerContainer.title }>Kilóméteróra</Text>
                    {
                        openEditCarStep &&
                       <Button.Icon
                          icon={ ICON_NAMES.pencil }
                          iconSize={ FONT_SIZES.h3 }
                          iconColor={ COLORS.gray1 }
                          width={ FONT_SIZES.h3 }
                          height={ FONT_SIZES.h3 }
                          backgroundColor="transparent"
                          onPress={ () => openEditCarStep(CAR_FORM_STEPS.OdometerStep) }
                       />
                    }
                </View>
                <Odometer value={ car.odometer.value } unit={ car.odometer.unit }/>
                {
                    openOdometerLog &&
                   <Link
                      text="Kilométeróra-állás napló"
                      icon={ ICON_NAMES.rightArrowHead }
                      onPress={ openOdometerLog }
                   />
                }
            </View>
            <FuelGauge
                value={ car.fuelTank.value }
                tankSize={ car.fuelTank.capacity }
                fuelType={ car.fuelTank.type }
                unit={ car.fuelTank.unit }
                disabled={ fuelSliderDisabled }
                openEditForm={ () => openEditCarStep(CAR_FORM_STEPS.FuelStep) }
            />
        </View>);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        gap: SEPARATOR_SIZES.normal
    },
    imageContainer: {
        flexDirection: "row",
        height: hp(25),
        justifyContent: "center",
        gap: SEPARATOR_SIZES.small,
        overflow: "hidden"
    },
    editImageIconContainer: {
        flex: 1,
        justifyContent: "flex-end",
        padding: SEPARATOR_SIZES.lightSmall
    },
    editImageIcon: {
        alignSelf: "flex-end"
    },
    contentRowContainer: {
        gap: SEPARATOR_SIZES.lightSmall / 2.5,
        backgroundColor: COLORS.black4,
        padding: SEPARATOR_SIZES.mediumSmall,
        borderRadius: 25
    },
    carNameText: {
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.p1,
        letterSpacing: FONT_SIZES.p1 * 0.045,
        color: COLORS.white
    },
    carInfoRow: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        gap: SEPARATOR_SIZES.lightSmall,

        title: {
            fontFamily: "Gilroy-Medium",
            fontSize: FONT_SIZES.p2,
            letterSpacing: FONT_SIZES.p2 * 0.05,
            color: COLORS.gray1
        },

        infoContainer: {
            flex: 1,
            alignItems: "center",
            justifyContent: "flex-end",

            text: {
                fontFamily: "Gilroy-Heavy",
                fontSize: FONT_SIZES.p2,
                letterSpacing: FONT_SIZES.p2 * 0.05,
                color: COLORS.gray1
            }
        }
    },
    odometerContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",

        title: {
            flexShrink: 1,
            fontFamily: "Gilroy-Medium",
            fontSize: FONT_SIZES.p2,
            letterSpacing: FONT_SIZES.p2 * 0.05,
            color: COLORS.gray1
        }
    }
});

export default CarProfileView;