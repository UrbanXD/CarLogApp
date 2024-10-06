import React, { useEffect, useState } from "react";
import {Alert, TouchableOpacity, View} from "react-native";
import { FONT_SIZES, SIMPLE_HEADER_HEIGHT } from "../../core/constants/constants";
import Picker from "../../core/components/input/InputPicker/Picker";
import Header from "../components/Header";
import { Avatar } from "react-native-paper";
import { theme } from "../../core/constants/theme";
import { useSelector } from "react-redux";
import { RootState, store } from "../../core/redux/store";
import { loadSelectedCar, selectCar } from "../../core/redux/reducers/cars.slices";
import { createSelector } from "@reduxjs/toolkit";
import { useDatabase } from "../../core/utils/database/Database";

const CarHeader: React.FC = () => {
    const { supabaseConnector } = useDatabase();

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
        <Header
            height={ SIMPLE_HEADER_HEIGHT }
        >
            <Header.StatusBar
                backgroundColor={ theme.colors.black2 }
            />
            <Header.Row paddingRight={!isDropdownVisible ? undefined : 0}>
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
                    <TouchableOpacity
                        style={{ flex: 1, alignItems: "flex-end" }}
                        onPress={ async () => {
                            try {
                                await supabaseConnector.client.auth.signOut();
                                console.log("logout")
                            } catch (e: any){
                                Alert.alert(e.message)
                            }
                        }}
                    >
                        <Avatar.Text label={"UA"} size={FONT_SIZES.large * 1.25} />
                    </TouchableOpacity>
                }
            </Header.Row>
        </Header>
    )
}

export default CarHeader;