import { Car } from "../../schemas/carSchema.ts";
import { StyleSheet, Text, View } from "react-native";
import Icon from "../../../../components/Icon.tsx";
import { COLORS, FONT_SIZES, ICON_FONT_SIZE_SCALE, ICON_NAMES, SEPARATOR_SIZES } from "../../../../constants";
import { IntelligentMarquee } from "../../../../components/marquee/IntelligentMarquee.tsx";
import React from "react";
import { MoreDataLoading } from "../../../../components/loading/MoreDataLoading.tsx";

type SelectedCarProps = {
    car: Car | null
    placeholder: string
    isCarsLoading: boolean
    userDontHaveCars: boolean
    userDontHaveCarsPlaceholder: string
}

export function SelectedCar({
    car,
    placeholder,
    isCarsLoading,
    userDontHaveCars,
    userDontHaveCarsPlaceholder
}: SelectedCarProps) {
    return (
        <View style={ styles.container }>
            <Icon
                icon={ ICON_NAMES.car }
                size={ FONT_SIZES.p1 * ICON_FONT_SIZE_SCALE }
                color={ COLORS.white }
            />
            {
                !isCarsLoading && userDontHaveCars
                ?
                <View style={ { width: "75%" } }>
                    <Text style={ styles.model }>
                        { userDontHaveCarsPlaceholder }
                    </Text>
                </View>
                :
                <View style={ { flex: 1 } }>
                    {
                        car &&
                       <IntelligentMarquee
                          speed={ 0.65 }
                          delay={ 800 }
                          bounceDelay={ 800 }
                          spacing={ SEPARATOR_SIZES.lightSmall }
                       >
                          <Text style={ styles.name } numberOfLines={ 1 }>
                              { car.name }
                          </Text>
                       </IntelligentMarquee>
                    }
                    {
                        isCarsLoading && !car
                        ?
                        <MoreDataLoading withText={ false } containerStyle={ { alignSelf: "flex-start" } }/>
                        :
                        <IntelligentMarquee
                            speed={ 0.65 }
                            delay={ 800 }
                            bounceDelay={ 800 }
                            spacing={ SEPARATOR_SIZES.lightSmall }
                        >
                            <Text style={ styles.model } numberOfLines={ 1 }>
                                {
                                    car
                                    ? `${ car.model.make.name } ${ car.model.name }`
                                    : placeholder
                                }
                            </Text>
                        </IntelligentMarquee>
                    }
                </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: SEPARATOR_SIZES.lightSmall
    },
    name: {
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.p3,
        letterSpacing: FONT_SIZES.p3 * 0.05,
        color: COLORS.white
    },
    model: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p3 * 0.9,
        letterSpacing: FONT_SIZES.p3 * 0.9 * 0.05,
        color: COLORS.gray1
    }
});