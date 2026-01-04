import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Image from "../../../../components/Image.tsx";
import { COLORS, FONT_SIZES, ICON_FONT_SIZE_SCALE, ICON_NAMES, SEPARATOR_SIZES } from "../../../../constants/index.ts";
import Button from "../../../../components/Button/Button.ts";
import { EDIT_CAR_FORM_STEPS } from "../../constants/index.ts";
import Divider from "../../../../components/Divider.tsx";
import { Odometer } from "../../_features/odometer/components/Odometer.tsx";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Car } from "../../schemas/carSchema.ts";
import { IntelligentMarquee } from "../../../../components/marquee/IntelligentMarquee.tsx";
import Link from "../../../../components/Link.tsx";
import { InfoContainer } from "../../../../components/info/InfoContainer.tsx";
import { InfoRowProps } from "../../../../components/info/InfoRow.tsx";
import { useTranslation } from "react-i18next";

type CarProfileViewProps = {
    car: Car
    openEditCarStep: (stepIndex: EDIT_CAR_FORM_STEPS) => void
    imageIsAttachment?: boolean
    handleDeleteCar?: () => void
    openOdometerLog?: () => void
    openEditOdometerValue?: () => void
}

const MARQUEE_SPEED = 0.65;
const MARQUEE_DELAY = 0;
const MARQUEE_BOUNCE_DELAY = 500;

function CarProfileView({
    car,
    openEditCarStep,
    imageIsAttachment = true,
    handleDeleteCar,
    openOdometerLog,
    openEditOdometerValue
}: CarProfileViewProps) {
    const { t } = useTranslation();

    const infos: Array<InfoRowProps> = useMemo(() => ([
        {
            title: t(`fuel.types.${ car.fuelTank.type.key }`),
            content: t("fuel.types.title"),
            onPress: () => openEditCarStep(EDIT_CAR_FORM_STEPS.FuelType)
        }, {
            title: car.fuelTank.capacity.toString(),
            content: t("fuel.tank_capacity"),
            onPress: () => openEditCarStep(EDIT_CAR_FORM_STEPS.FuelTankCapacity)
        }, {
            title: car.fuelTank.unit.short,
            content: t("fuel.unit_types.title"),
            onPress: () => openEditCarStep(EDIT_CAR_FORM_STEPS.FuelUnit)
        }, {
            title: car.odometer.unit.short,
            content: t("odometer.unit_types.title"),
            onPress: () => openEditCarStep(EDIT_CAR_FORM_STEPS.OdometerUnit)
        }, {
            title: car.currency.symbol,
            content: t("currency.primary"),
            onPress: () => openEditCarStep(EDIT_CAR_FORM_STEPS.Currency)
        }
    ]), [car, openEditCarStep, t]);

    return (
        <View style={ styles.container }>
            <View style={ styles.imageContainer }>
                <Image
                    path={ car.imagePath }
                    attachment={ imageIsAttachment }
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
                            onPress={ () => openEditCarStep(EDIT_CAR_FORM_STEPS.Image) }
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
                        onPress={ () => openEditCarStep(EDIT_CAR_FORM_STEPS.Name) }
                    />
                </View>
                <Divider
                    color={ COLORS.gray3 }
                    margin={ SEPARATOR_SIZES.lightSmall / 2.5 }
                />
                <View style={ styles.carInfoRow }>
                    <Text style={ styles.carInfoRow.title }>{ t("car.make") }</Text>
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
                    <Text style={ styles.carInfoRow.title }>{ t("car.model") }</Text>
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
                    <Text style={ styles.carInfoRow.title }>{ t("car.model_year") }</Text>
                    <View style={ styles.carInfoRow.infoContainer }>
                        <IntelligentMarquee
                            speed={ MARQUEE_SPEED }
                            bounceDelay={ MARQUEE_BOUNCE_DELAY }
                            delay={ MARQUEE_DELAY }
                            spacing={ SEPARATOR_SIZES.medium }
                            style={ { alignSelf: "flex-end" } }
                        >
                            <Text style={ styles.carInfoRow.infoContainer.text }>{ car.model.year }</Text>
                        </IntelligentMarquee>
                    </View>
                </View>
                <Button.Row
                    style={ {
                        marginTop: SEPARATOR_SIZES.mediumSmall,
                        justifyContent: handleDeleteCar ? "space-between" : "center"
                    } }
                >
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
                        text={ t("form_button.edit") }
                        textColor={ COLORS.gray1 }
                        fontSize={ FONT_SIZES.p2 }
                        height={ FONT_SIZES.p2 * 2 }
                        backgroundColor="transparent"
                        style={ { flex: 0.75, borderColor: COLORS.gray1, borderWidth: 2.5 } }
                        onPress={ () => openEditCarStep(EDIT_CAR_FORM_STEPS.CarModel) }
                    />
                </Button.Row>
            </View>
            <View style={ styles.block }>
                <Text style={ styles.block.title }>{ t("car.basic_information") }</Text>
                <InfoContainer data={ infos } flexDirection={ "column" } maxItemInRow={ 3 }/>
            </View>
            <View style={ styles.block }>
                <View
                    style={ {
                        flexDirection: "row",
                        justifyContent: openEditOdometerValue ? "space-between" : "center"
                    } }
                >
                    {
                        openEditOdometerValue &&
                       <View style={ { width: FONT_SIZES.h3, height: FONT_SIZES.h3, backgroundColor: "transparent" } }/>
                    }
                    <Text style={ styles.block.title }>{ t("odometer.text") }</Text>
                    {
                        openEditOdometerValue &&
                       <Button.Icon
                          icon={ ICON_NAMES.pencil }
                          iconSize={ FONT_SIZES.h3 }
                          iconColor={ COLORS.gray1 }
                          width={ FONT_SIZES.h3 }
                          height={ FONT_SIZES.h3 }
                          backgroundColor="transparent"
                          onPress={ openEditOdometerValue }
                       />
                    }
                </View>
                <Odometer value={ car.odometer.value } unit={ car.odometer.unit.short }/>
                {
                    openOdometerLog &&
                   <Link
                      text={ t("odometer.open_log") }
                      icon={ ICON_NAMES.rightArrowHead }
                      onPress={ openOdometerLog }
                   />
                }
            </View>
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
        height: hp(22.5),
        justifyContent: "center",
        gap: SEPARATOR_SIZES.small,
        overflow: "hidden"
    },
    editImageIconContainer: {
        flex: 1,
        justifyContent: "flex-end",
        padding: SEPARATOR_SIZES.small
    },
    editImageIcon: {
        alignSelf: "flex-end"
    },
    contentRowContainer: {
        gap: SEPARATOR_SIZES.lightSmall / 2.5,
        backgroundColor: COLORS.black4,
        padding: SEPARATOR_SIZES.normal,
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
    block: {
        gap: SEPARATOR_SIZES.lightSmall,

        title: {
            flexShrink: 1,
            fontFamily: "Gilroy-Medium",
            fontSize: FONT_SIZES.p2,
            letterSpacing: FONT_SIZES.p2 * 0.05,
            textAlign: "center",
            color: COLORS.gray1
        }
    }
});

export default CarProfileView;