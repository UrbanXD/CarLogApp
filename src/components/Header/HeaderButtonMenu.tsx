import React from "react";
import { View } from "react-native";
import { IconButton, IconButtonProps } from "react-native-paper";
import {GET_ICON_BUTTON_RESET_STYLE} from "../../constants/constants";

interface HeaderButtonMenuProp {
    icons?: IconButtonProps[]
}

const HeaderBackButton: React.FC<HeaderButtonMenuProp> = ({ icons = [] }) => {
    return (
            <View>
                {
                    icons.length !== 0
                        ? icons.map(
                            (iconProp, index) =>
                                <IconButton key={ index } { ...iconProp } style={ GET_ICON_BUTTON_RESET_STYLE(iconProp.size) } />
                          )
                        : <IconButton key={ 1 }  icon="home" iconColor="transparent" disabled style={ GET_ICON_BUTTON_RESET_STYLE() } />
                }
            </View>
    )
}

export default HeaderBackButton;