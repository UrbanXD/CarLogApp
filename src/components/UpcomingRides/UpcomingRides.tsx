import React, {useCallback, useEffect, useRef, useState} from "react";
import {StyleSheet, Text, View} from "react-native";
import {FONT_SIZES, GET_ICON_BUTTON_RESET_STYLE, ICON_NAMES, SEPARATOR_SIZES} from "../../constants/constants";
import RideInfo from "./RideInfo";
import Date from "./Date";
import {heightPercentageToDP as hp} from "react-native-responsive-screen";
import {theme} from "../../constants/theme";
import {IconButton, Portal} from "react-native-paper";
import BottomSheet, {BottomSheetMethods} from "../BottomSheet/BottomSheet";
import InputText from "../Form/InputText";
import {useForm} from "react-hook-form";
import {LoginFormFieldType, loginUseFormProps} from "../../constants/formSchema/loginForm";
import {EditRideFormFieldType, editRideUseFormProps} from "../../constants/formSchema/editRideForm";
import {getToday} from "../../utils/getDate";

type RideType = {
    carUID: string
    carOwnerUID: string
    dateTitle: string
    dateSubtitle: string
    time: string
    locations: Array<{
        city: string,
        place?: string
    }>
    client: string,
    passengerCount?: number,
    comment?: string
}

interface UpcomingRidesProps {
    rides: Array<RideType>
}

const UpcomingRides: React.FC<UpcomingRidesProps> = ({ rides }) => {
    const [selectedRideIndex, setSelectedRideIndex] = useState(0);
    const [selectedRideValues, setSelectedRideValues] = useState<EditRideFormFieldType>(editRideUseFormProps.defaultValues);
    const bottomSheetRef = useRef<BottomSheetMethods>(null);

    const { control, handleSubmit } =
        useForm<EditRideFormFieldType>(
            {
                    ...editRideUseFormProps,
                    values: selectedRideValues
                  }
        )

    const expandHandler = useCallback((index: number) => {
        setSelectedRideIndex(index);
        bottomSheetRef.current?.expand();
    }, []);

    useEffect(() => {
        setSelectedRideValues({
            carUID: rides[selectedRideIndex].carUID,
            carOwnerUID: rides[selectedRideIndex].carOwnerUID,
            date: getToday(),
            time: rides[selectedRideIndex].time,
            client: rides[selectedRideIndex].client,
            passengerCount: rides[selectedRideIndex].passengerCount || 1,
            comment: rides[selectedRideIndex].comment || "",
            locations: rides[selectedRideIndex].locations
        });
    }, [selectedRideIndex]);

    return (
        <>
            <Portal>
                <BottomSheet ref={ bottomSheetRef }>
                    <View style={ styles.infoContainer }>
                        <View style={ styles.infoTitleContainer }>
                            <Date
                                dateTitle={ rides[selectedRideIndex].dateTitle }
                                dateSubtitle={ rides[selectedRideIndex].dateSubtitle }
                                flexDirection="row"
                            />
                            <Text style={{color: "white" }}>{ rides[selectedRideIndex].time }</Text>
                        </View>
                        <View style={ styles.infoContentContainer }>
                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                <InputText control={control} fieldName={"carUID"} isEditable={ true }  />
                                <View style={{ backgroundColor: "blue" }}>
                                    <Text style={{ color: "white"}}>Szemelyek szama</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: "row" }}>
                                <View style={{ flex: 1, backgroundColor: "red" }}>
                                    <Text style={{ color: "white" }}>CAr ID</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: "row" }}>
                                <View style={{ flex: 1, backgroundColor: "red" }}>
                                    <Text style={{ color: "white" }}>Comment</Text>
                                </View>
                            </View>
                            <Text style={{ color: "white" }}> Locations pl: Utca 21. (Zenta) </Text>
                        </View>
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
                                        text={ ride.locations[0].city }
                                    />
                                    <RideInfo
                                        icon={ ICON_NAMES.destinationPointMarker }
                                        text={ ride.locations[ride.locations.length - 1].city }
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
    infoContainer: {
        flex: 1,
        gap: SEPARATOR_SIZES.extraMedium
    },
    infoTitleContainer: {
        alignItems: "center",
        // justifyContent: "center",
        transform: [{ scale: 1.25 }]
    },
    infoContentContainer: {
        gap: SEPARATOR_SIZES.small
    },
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