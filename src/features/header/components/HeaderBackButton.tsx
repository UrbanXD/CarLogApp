import React from "react";
import { IconButton } from "react-native-paper";
import { router } from "expo-router";

interface HeaderBackButtonProps {
    backAction?: () => void,
    isAbsolute?: boolean
}

const HeaderBackButton: React.FC<HeaderBackButtonProps> = ({
    backAction,
    isAbsolute
}) => {
    return (
        <IconButton
            style={{ margin: 0, position: isAbsolute ? "absolute" : "relative"}}
            icon="arrow-left"
            size={ 28 }
            iconColor={ "whitesmoke" }
            onPress={ () => backAction ? backAction() : router.back() }
        />
    )
}

export default HeaderBackButton;