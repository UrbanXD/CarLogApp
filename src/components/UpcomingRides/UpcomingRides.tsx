import React, {useCallback, useRef, useState} from "react";
import {StyleSheet, Text, View} from "react-native";
import {FONT_SIZES, GET_ICON_BUTTON_RESET_STYLE, ICON_NAMES, SEPARATOR_SIZES} from "../../constants/constants";
import RideInfo from "./RideInfo";
import Date from "./Date";
import {heightPercentageToDP as hp} from "react-native-responsive-screen";
import {theme} from "../../styles/theme";
import {IconButton, Portal} from "react-native-paper";
import BottomSheet, {BottomSheetMethods} from "../BottomSheet/BottomSheet";

type RideType = {
    dateTitle: string
    dateSubtitle: string
    time: string
    startingCity: string
    startingPlace?: string
    destinationCity: string
    destinationPlace?: string
    client: string,
    passengerCount?: number,
    comment?: string
}

interface UpcomingRidesProps {
    rides: Array<RideType>
}

const UpcomingRides: React.FC<UpcomingRidesProps> = ({ rides }) => {
    const [selectedRideIndex, setSelectedRideIndex] = useState(0);
    const bottomSheetRef = useRef<BottomSheetMethods>(null);

    const expandHandler = useCallback((index: number) => {
        setSelectedRideIndex(index);
        bottomSheetRef.current?.expand();
    }, []);

    return (
        <>
            <Portal>
                <BottomSheet ref={ bottomSheetRef }>
                    <View>
                        <Text style={ { color: "white" } }>
                            { rides[selectedRideIndex].client }
                        </Text>
                        <Text style={ { color: "white" } }>
                            { rides[selectedRideIndex].startingPlace }
                        </Text>
                    </View>
                </BottomSheet>
            </Portal>
            <View style={ styles.container }>
                {
                    rides.map((ride, index) =>
                        <View key={ index } style={ styles.contentContainer }>
                            <Date
                                dateTitle={ ride.dateTitle }
                                dateSubtitle={ ride.dateSubtitle }
                            />
                            <View style={ styles.rowContainer }>
                                <View style={ styles.rowContentContainer }>
                                    <RideInfo
                                        icon={ ICON_NAMES.startingPointMarker }
                                        text={ ride.startingCity }
                                    />
                                    <RideInfo
                                        icon={ ICON_NAMES.destinationPointMarker }
                                        text={ ride.destinationCity }
                                    />
                                    <RideInfo
                                        icon={ ICON_NAMES.user }
                                        text={ ride.client }
                                    />
                                    <RideInfo
                                        icon={ ICON_NAMES.clock }
                                        text={ ride.time }
                                    />
                                </View>
                                <IconButton
                                    onPress={ () => expandHandler(index) }
                                    size={ FONT_SIZES.medium }
                                    icon={ ICON_NAMES.info }
                                    iconColor={"white"}
                                    style={ GET_ICON_BUTTON_RESET_STYLE(FONT_SIZES.medium) }
                                />
                            </View>
                        </View>
                    )
                }
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: SEPARATOR_SIZES.small
    },
    contentContainer: {
        flexDirection: "row",
        gap: SEPARATOR_SIZES.lightSmall
    },
    rowContainer: {
        flex: 1,
        flexDirection: "row",
        height: hp(25),
        backgroundColor: theme.colors.black2,
        borderRadius: 15,
        padding: SEPARATOR_SIZES.small
    },
    rowContentContainer: {
        flex: 1,
        gap: SEPARATOR_SIZES.lightSmall,
        justifyContent: "center"
    }
})

export default UpcomingRides;