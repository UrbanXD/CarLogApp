import React from "react";
import IconButton from "../IconButton";
import {ICON_NAMES} from "../../../constants/constants";
import {heightPercentageToDP as hp} from "react-native-responsive-screen";

interface MultistepFormBackButtonProps {
    onPress: () => void
}

const MultistepFormBackButton: React.FC<MultistepFormBackButtonProps> = ({
    onPress
}) =>
    <IconButton
        icon={ ICON_NAMES.leftArrowHead }
        width={ hp(7) }
        onPress={ onPress }
    />

export default MultistepFormBackButton;