import React, { useEffect, useState } from "react";
import { Alert, StatusBar, TouchableOpacity, View, StyleSheet } from "react-native";
import {DEFAULT_SEPARATOR, FONT_SIZES, SEPARATOR_SIZES, SIMPLE_HEADER_HEIGHT } from "../../constants/constants";
import Picker from "../form/InputPicker/Picker";
import { theme } from "../../constants/theme";
import { useSelector } from "react-redux";
import { RootState, store } from "../../redux/store";
import { createSelector } from "@reduxjs/toolkit";
import { useDatabase } from "../../utils/database/Database";
import { loadSelectedCar, selectCar } from "../../redux/cars/cars.slices";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Avatar from "../shared/avatar/Avatar";

const Header: React.FC = () => {
    const { supabaseConnector } = useDatabase();
    const insets = useSafeAreaInsets();

    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const selectCarsState = (state: RootState) => state.cars.cars;

    const selectCarsForCarousel = createSelector(
        [selectCarsState],
        (cars) => cars.map((car, index) => ({
            id: car.id,
            title: car.name,
            subtitle: `${ car.brand }, ${ car.model }`,
        }))
    );

    const cars = useSelector(selectCarsForCarousel);
    const carsIsLoading = useSelector<RootState>(state => state.cars.loading);
    const selectedCarID = useSelector<RootState, string>(state => state.cars.selectedCarID);

    const onCarSelect = (id: string) => {
        store.dispatch(selectCar(id));
    }

    useEffect(() => {
        store.dispatch(loadSelectedCar({}));
    }, []);

    return (
        <View style={{ paddingTop: insets.top }}>
            <StatusBar
                barStyle={ "light-content" }
                backgroundColor={ theme.colors.black2 }
            />
            <View style={ styles.barContainer }>
                <View style={{ flex: 1 }}>
                    {
                        !carsIsLoading &&
                        <Picker
                            data={ cars }
                            selectedItemID={ selectedCarID }
                            isDropdown={ true }
                            onDropdownToggle={ setIsDropdownVisible }
                            onSelect={ onCarSelect }
                            placeholder={ "Válasszon autót" }
                        />
                    }
                </View>
                {
                    !isDropdownVisible &&
                    <Avatar.Text
                        label={ "Ka" }
                        avatarSize={ SIMPLE_HEADER_HEIGHT * 0.85 }
                        onPress={
                            async () => {
                                try {
                                    await supabaseConnector.client.auth.signOut();
                                    console.log("logout")
                                } catch (e: any){
                                    Alert.alert(e.message)
                                }
                            }
                        }
                    />
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    barContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: SEPARATOR_SIZES.lightSmall,
        height: SIMPLE_HEADER_HEIGHT,
        backgroundColor: theme.colors.black2,
        paddingVertical: SEPARATOR_SIZES.lightSmall * 0.5,
        paddingHorizontal: DEFAULT_SEPARATOR,
        overflow: "hidden"
    }
})

export default Header;