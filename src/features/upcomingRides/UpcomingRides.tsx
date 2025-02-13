import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { FONT_SIZES, GLOBAL_STYLE, ICON_NAMES, SEPARATOR_SIZES } from "../../constants/constants";
import Date from "../../components/Date";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { theme } from "../../constants/theme";
import { useForm } from "react-hook-form";
import { getToday } from "../../utils/getDate";
import { EditRideFormFieldType, editRideUseFormProps } from "../Form/layouts/editRide/editRideFormSchema";
import InputText from "../Form/components/Input/text/InputText";
import ProgressBar from "../../components/ProgressBar";
import Icon from "../../components/Icon";
import { useBottomSheet } from "../BottomSheet/context/BottomSheetContext.ts";

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
    const { openBottomSheet } = useBottomSheet();

    return (
        <View style={ styles.container }>
            {
                rides.map((ride, index) =>
                    <View key={ index } style={ styles.contentContainer }>
                        <View style={ styles.rowContainer }>
                            <Date
                                dateTitle={ ride.dateTitle }
                                dateUpperSubtitle={ ride.time }
                                dateUnderSubtitle={ ride.dateSubtitle }
                            />
                            <View style={{ flex: 1, gap: SEPARATOR_SIZES.lightSmall }}>
                                <Text numberOfLines={ 2 } style={ [GLOBAL_STYLE.containerText, { color: theme.colors.white }] }>
                                    { ride.client }
                                </Text>
                                <ScrollView contentContainerStyle={ GLOBAL_STYLE.scrollViewContentContainer }>
                                    <ProgressBar
                                        isVertical
                                        stepsCount={3}
                                        titles={["Zenta", "Kamenica"]}
                                    />
                                </ScrollView>
                                <Text numberOfLines={ 1 } style={ [GLOBAL_STYLE.containerText, { color: theme.colors.white }] }>
                                    100 km
                                </Text>
                        </View>
                            <Icon
                                icon={ ICON_NAMES.info }
                                size={ FONT_SIZES.medium }
                                color={ theme.colors.white }
                                onPress={
                                    () =>{
                                        console.log("xdd")
                                        openBottomSheet({
                                            title: "Edit Ride",
                                            content: <EditRideForm ride={ ride } />,
                                            snapPoints: ["85%"]
                                        })
                                        }
                                }
                            />
                        </View>
                    </View>
                )
            }
        </View>
    )
}

interface EditRideFormProps {
    ride: RideType
}

const EditRideForm: React.FC<EditRideFormProps> = React.memo(({ ride }) => {
    const rideValue = useMemo(() => ({
        ...ride,
        passengerCount: ride.passengerCount || 1,
        comment: ride.comment || "",
        date: getToday()
    }), [ride]);

    const { control, setValue } =
        useForm<EditRideFormFieldType>(
            {
                ...editRideUseFormProps,
                values: rideValue
            }
        )


    return (
        <View style={ styles.infoContainer }>
            <View style={ styles.infoTitleContainer }>
                <Date
                    dateTitle={ ride.dateTitle }
                    dateUnderSubtitle={ ride.dateSubtitle }
                    flexDirection="row"
                />
                <Text style={{color: "white" }}>
                    { ride.time }
                </Text>
            </View>
            <View style={ styles.infoContentContainer }>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <InputText
                        control={control}
                        fieldName={"carUID"}
                        isEditable={ true }
                    />
                    <View style={{ backgroundColor: "blue" }}>
                        <Text style={{ color: "white"}}>Szemelyek szama { ride.client }</Text>
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
    )
})

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
    container2: {
        flexDirection: "row",
        gap: SEPARATOR_SIZES.lightSmall * 0.5,
        paddingLeft: SEPARATOR_SIZES.lightSmall * 0.75,
        alignItems: "center"
    },
    text: {
        flexWrap: "wrap",
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.small,
        color: theme.colors.white
    },
    contentContainer: {
        flexDirection: "row",
        gap: SEPARATOR_SIZES.lightSmall
    },
    rowContainer: {
        flex: 1,
        flexDirection: "row",
        height: hp(22.5),
        backgroundColor: theme.colors.black2,
        borderRadius: 15,
        padding: SEPARATOR_SIZES.small,
    },
    rowContentContainer: {
        flex: 1,
        gap: SEPARATOR_SIZES.lightSmall,
        justifyContent: "center"
    }
})

export default UpcomingRides;