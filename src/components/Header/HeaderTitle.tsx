import React, {ReactNode} from "react";
import {Image, ImageSourcePropType, StyleSheet, Text, TextStyle, View} from "react-native";
import {Divider} from "react-native-paper";
import {theme} from "../../constants/theme";

interface HeaderTitleProp {
    title?: string,
    subAction?: ReactNode | null
    titleStyle?: TextStyle,
    isTitleCenter?: boolean,
    image?: ImageSourcePropType
}

const HeaderTitle: React.FC<HeaderTitleProp> = ({ title, subAction, titleStyle= {}, isTitleCenter, image }) => {
    return (
        <View style={ [style.titleContainer, { justifyContent: isTitleCenter ? "center" : "flex-start" }] }>
            {
                image
                ? <Image
                        source={ image }
                        resizeMode="contain"
                        style={ style.titleLogo }
                 />
                : <></>
            }
            <View>
                {
                    title
                        ? <Text style={ titleStyle }>{ title }</Text>
                        : <></>
                }
                { subAction }
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    titleContainer: {
        flex: 1,
        gap: 10,
        flexDirection: "row",
        alignItems: "center",
        zIndex: 1,
    },
    titleLogo: {
        alignSelf: "center",
        height: 50, width: 50
    }
})

export default HeaderTitle;