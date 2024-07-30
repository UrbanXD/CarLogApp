import React from "react";
import { View } from "react-native";
import { IconButton, IconButtonProps } from "react-native-paper";

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
                                <IconButton key={ index } {...iconProp} />
                          )
                        : <IconButton key={ 1 }  icon={"home"}  iconColor={"transparent"} disabled />
                }
            </View>
    )
}

export default HeaderBackButton;