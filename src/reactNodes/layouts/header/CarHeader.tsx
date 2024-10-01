import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { FONT_SIZES, SIMPLE_HEADER_HEIGHT } from "../../../constants/constants";
import Picker from "../../../components/Input/InputPicker/Picker";
import Header from "../../../components/Header/Header";
import { Avatar } from "react-native-paper";
import { theme } from "../../../constants/theme";
import { useSelector } from "react-redux";
import { RootState, store } from "../../../redux/store";
import { loadSelectedCar, selectCar } from "../../../redux/reducers/cars.slices";
import { createSelector } from "@reduxjs/toolkit";

const CarHeader: React.FC = () => {
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
                    <View style={{ flex: 1, alignItems: "flex-end" }}>
                        <Avatar.Text label={"UA"} size={FONT_SIZES.large * 1.25} />
                    </View>
                }
            </Header.Row>
        </Header>
    )
}

export default CarHeader;