import React from "react";
import {IconButton} from "react-native-paper";
import {headerFontSizes, headerIconColors} from "../../styles/headers.style";
import {router} from "expo-router";

const HeaderBackButton: React.FC = () => {
    return (
        <IconButton
            style={{ margin: 0 }}
            icon="arrow-left"
            size={ headerFontSizes.icon }
            iconColor={ headerIconColors.light }
            onPress={ router.back }
        />
    )
}

export default HeaderBackButton;