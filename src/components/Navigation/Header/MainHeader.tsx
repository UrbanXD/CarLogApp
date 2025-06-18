import React, { useEffect, useState } from "react";
import { StatusBar, View } from "react-native";
import { GLOBAL_STYLE, SIMPLE_HEADER_HEIGHT } from "../../../constants/index.ts";
import Picker, {PickerDataType} from "../../Input/picker/Picker.tsx";
import { useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Avatar from "../../Avatar/Avatar.ts";
import useHeaderStyles from "../../../hooks/useHeaderStyles.tsx";
import { router } from "expo-router";
import { getLabelByName } from "../../../utils/getLabelByName.ts";
import { useAuth } from "../../../contexts/Auth/AuthContext.ts";
import { RootState } from "../../../database/redux/index.ts";
import { loadSelectedCar } from "../../../database/redux/car/actions/loadSelectedCar.ts";
import { selectCar } from "../../../database/redux/car/actions/selectCar.ts";
import { store } from "../../../database/redux/store.ts";

const MainHeader: React.FC = () => {
    const { user, userAvatar, isUserLoading} = useAuth();
    const { top } = useSafeAreaInsets();
    const styles = useHeaderStyles(top);

    const name = `${ user?.lastname } ${ user?.firstname }`;
    const avatarColor = user?.avatarColor;

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

    const cars = useSelector(selectCarsForCarousel) as Array<PickerDataType>;
    const carsIsLoading = useSelector<RootState>(state => state.cars.loading);
    const selectedCarID = useSelector<RootState, string>(state => state.cars.selectedCarID);

    const onCarSelect = (id: string) => {
        store.dispatch(selectCar(id));
    }

    useEffect(() => {
        store.dispatch(loadSelectedCar({}));
    }, []);

    const openProfile = () => {
        router.push("/(profile)/user")
    }

    return (
        <View style={ styles.wrapper }>
            <StatusBar
                barStyle="light-content"
                backgroundColor={ GLOBAL_STYLE.pageContainer.backgroundColor }
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
                    !isDropdownVisible && (
                        isUserLoading
                            ?   <Avatar.Skeleton
                                    avatarSize={ SIMPLE_HEADER_HEIGHT * 0.85 }
                                />
                            :   userAvatar
                                    ?   <Avatar.Image
                                            source={ userAvatar.image }
                                            avatarSize={ SIMPLE_HEADER_HEIGHT * 0.85 }
                                            onPress={ openProfile }
                                        />
                                    :   <Avatar.Text
                                            label={ getLabelByName(name) }
                                            avatarSize={ SIMPLE_HEADER_HEIGHT * 0.85 }
                                            backgroundColor={ avatarColor ?? undefined }
                                            onPress={ openProfile }
                                        />
                    )
                }
            </View>
        </View>
    )
}

export default MainHeader;