import React, {ReactNode} from "react";
import {ColorValue, View} from "react-native";
import {headerStyles} from "../../styles/headers.style";

interface HeaderBarProp {
    children?: ReactNode | null,
    height: number,
    backgroundColor?: ColorValue
}

const HeaderBar: React.FC<HeaderBarProp> = ({ children, height }) => {
    return (
        <View style={[headerStyles.headerBar, { height }]}>
            { children }
        </View>
    )
}

export default HeaderBar;