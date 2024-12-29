import React, { useEffect, useState } from "react";
import { StatusBar, View, StyleSheet } from "react-native";
import {DEFAULT_SEPARATOR, SEPARATOR_SIZES, SIMPLE_HEADER_HEIGHT } from "../../constants/constants";
import Picker from "../../../Form/components/Input/picker/Picker";
import { theme } from "../../constants/theme";
import { useSelector } from "react-redux";
import { RootState, store } from "../../../Database/redux/store";
import { createSelector } from "@reduxjs/toolkit";
import { useDatabase } from "../../../Database/connector/Database";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Avatar from "../avatar/Avatar";
import { router } from "expo-router";
import { useAlert } from "../../../Alert/context/AlertProvider";
import { loadSelectedCar } from "../../../Database/redux/cars/functions/loadSelectedCar";
import { selectCar } from "../../../Database/redux/cars/functions/selectCar";

const Header: React.FC = () => {
    const { supabaseConnector, powersync } = useDatabase();
    const { addToast } = useAlert();
    const insets = useSafeAreaInsets();

    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const selectCarsState = (state: RootState) => state.cars.cars;

    const selectCarsForCarousel = createSelector(
        [selectCarsState],
        (cars) => cars.map(car => ({
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

    const logout = async () => {
        try {
            await supabaseConnector.client.auth.signOut();
            await powersync.disconnectAndClear();
            router.replace("/");
            addToast({
                type: "success",
                title: "Sikeres kijelentkezés!",
            });
        } catch (error: any){
            addToast({
                type: "error",
                body: "Váratlan hiba lépett fel a kijelentkezés!"
            });
        }
    }

    useEffect(() => {
        store.dispatch(loadSelectedCar({}));
    }, []);

    return (
        <View style={{ paddingTop: insets.top }}>
            <StatusBar
                barStyle="light-content"
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
                        onPress={ logout }
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
        paddingTop: SEPARATOR_SIZES.lightSmall * 0.5,
        paddingHorizontal: DEFAULT_SEPARATOR,
        overflow: "hidden"
    }
})

export default Header;