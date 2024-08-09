import React from "react";
import {View, ViewStyle} from "react-native";
import { IconButton, IconButtonProps } from "react-native-paper";
import {GET_ICON_BUTTON_RESET_STYLE} from "../../constants/constants";

interface HeaderButtonMenuProps {
    icons?: IconButtonProps[]
    containerStyle?: ViewStyle
}

const HeaderBackButton: React.FC<HeaderButtonMenuProps> = ({ icons = [], containerStyle }) => {
    return (
            <View style={ containerStyle }>
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