import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {ScrollView, StyleSheet, Text, View} from "react-native";
import {
    FONT_SIZES,
    GET_ICON_BUTTON_RESET_STYLE,
    GLOBAL_STYLE,
    ICON_NAMES,
    SEPARATOR_SIZES
} from "../../constants/constants";
import RideInfo from "./RideInfo";
import Date from "./Date";
import {heightPercentageToDP as hp} from "react-native-responsive-screen";
import {theme} from "../../constants/theme";
import {Divider, IconButton, Portal} from "react-native-paper";
import InputText from "../Input/InputText";
import {useForm} from "react-hook-form";
import {EditRideFormFieldType, editRideUseFormProps} from "../../constants/formSchema/editRideForm";
import {getToday} from "../../utils/getDate";
import Timeline from "../Timeline/Timeline";
import ProgressBar from "../MultiStepForm/ProgressBar";
import TextDivider from "../TextDivider/TextDivider";
import BottomSheet, {BottomSheetBackdrop, BottomSheetModal} from "@gorhom/bottom-sheet";
import CustomBottomSheet from "../BottomSheet/BottomSheet";

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

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    const { control, handleSubmit } =
        useForm<EditRideFormFieldType>(
            {
                    ...editRideUseFormProps,
                    values: selectedRideValues
                  }
        )

    const expandHandler = useCallback((index: number) => {
        setSelectedRideIndex(index);
        bottomSheetModalRef.current?.present();
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
                <CustomBottomSheet ref={ bottomSheetModalRef } title={"xd vnrs vnknrdnj njkjngn krkg nkrsn knkrznjgk nzsgrk "} >
                    <View style={ styles.infoContainer }>
                        <View style={ styles.infoTitleContainer }>
                            <Date
                                dateTitle={ rides[selectedRideIndex].dateTitle }
                                dateUnderSubtitle={ rides[selectedRideIndex].dateSubtitle }
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
                </CustomBottomSheet>
            </Portal>
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
                                        <ProgressBar isVertical stepsCount={3} titles={["Zenta", "Kamenica"]}/>
                                    </ScrollView>
                                    <Text numberOfLines={ 1 } style={ [GLOBAL_STYLE.containerText, { color: theme.colors.white }] }>
                                        100 km
                                    </Text>
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
    container2: {
        // flex: 1,
        flexDirection: "row",
        gap: SEPARATOR_SIZES.lightSmall * 0.5,
        paddingLeft: SEPARATOR_SIZES.lightSmall * 0.75,
        // justifyContent: "center",
        alignItems: "center"
    },
    text: {
        // flex: 1,
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