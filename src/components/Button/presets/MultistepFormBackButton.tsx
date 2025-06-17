import React from "react";
import IconButton from "../IconButton";
import { ICON_NAMES } from "../../../constants/constants";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

interface MultistepFormBackButtonProps {
    onPress: () => void
}

export const MultistepFormBackButton: React.FC<MultistepFormBackButtonProps> = ({
    onPress
}) =>
    <IconButton
        icon={ ICON_NAMES.leftArrowHead }
        width={ hp(6) }
        height={ hp(6) }
        onPress={ onPress }
    />