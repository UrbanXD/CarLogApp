import React, { useState } from "react";
import { View } from "react-native";
import { SIMPLE_HEADER_HEIGHT } from "../../../constants/index.ts";
import Avatar from "../../Avatar/Avatar.ts";
import { router } from "expo-router";
import { getLabelByName } from "../../../utils/getLabelByName.ts";
// import { loadSelectedCar } from "../../../features/car/model/actions/loadSelectedCar.ts";
// import { selectCar } from "../../../features/car/model/actions/selectCar.ts";
// import { store } from "../../../database/redux/store.ts";
// import { getCarsAsPickerElements, isLoading } from "../../../features/car/model/selectors/index.ts";
import { useAppSelector } from "../../../hooks/index.ts";
// import { getSelectedCarId } from "../../../features/car/model/selectors/getSelectedCarId.ts";
import HeaderView from "./HeaderView.tsx";
import { getUser, isUserLoading } from "../../../features/user/model/selectors/index.ts";

const PrimaryHeader: React.FC = () => {
    const user = useAppSelector(getUser);
    const userLoading = useAppSelector(isUserLoading);
    const name = `${ user?.lastname } ${ user?.firstname }`;

    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    // const cars = useAppSelector(getCarsAsPickerElements());
    // const carsLoading = useAppSelector(isLoading);
    // const selectedCarId = useAppSelector(getSelectedCarId);
    //
    // const onCarSelect = (id: string) => {
    //     store.dispatch(selectCar(id));
    // };
    //
    // useEffect(() => {
    //     store.dispatch(loadSelectedCar({}));
    // }, []);

    const openProfile = () => {
        router.push("/(profile)/user");
    };

    if(user === null) return null;

    return (
        <HeaderView>
            <View style={ { flex: 1 } }>
                {/*{*/ }
                {/*    !carsLoading &&*/ }
                {/*   <Input.Picker.Dropdown*/ }
                {/*      data={ cars }*/ }
                {/*      defaultSelectedElementId={ selectedCarId }*/ }
                {/*      setValue={ onCarSelect }*/ }
                {/*      horizontal*/ }
                {/*      icon={ ICON_NAMES.car }*/ }
                {/*      inputPlaceholder="Válasszon autót"*/ }
                {/*      onDropdownToggle={ (value) => setIsDropdownVisible(value) }*/ }
                {/*   />*/ }
                {/*}*/ }
            </View>
            {
                !isDropdownVisible && (
                    userLoading
                    ? <Avatar.Skeleton
                        avatarSize={ SIMPLE_HEADER_HEIGHT * 0.85 }
                    />
                    : user?.avatar
                      ? <Avatar.Image
                          source={ user.avatar.image }
                          avatarSize={ SIMPLE_HEADER_HEIGHT * 0.85 }
                          onPress={ openProfile }
                      />
                      : <Avatar.Text
                          label={ getLabelByName(name) }
                          avatarSize={ SIMPLE_HEADER_HEIGHT * 0.85 }
                          backgroundColor={ user.avatarColor }
                          onPress={ openProfile }
                      />
                )
            }
        </HeaderView>
    );
};

export default PrimaryHeader;