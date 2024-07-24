import React from "react";
import { Image, ImageSourcePropType, Text, TextStyle, View } from "react-native";
import { headerStyles } from "../../styles/headers.style";

interface HeaderTitleProp {
    title?: string,
        titleStyle?: TextStyle,
        image?: ImageSourcePropType
}

const HeaderTitle: React.FC<HeaderTitleProp> = ({ title, titleStyle= {}, image }) => {
    return (
        <View style={ headerStyles.headerTitleContainer }>
            {
                image
                ? <Image
                        source={ image }
                        resizeMode="contain"
                        style={ headerStyles.headerTitleLogo }
                 />
                : <></>
            }
            {
                title
                ? <Text style={ titleStyle }>{ title }</Text>
                : <></>
            }
        </View>
    )
}

export default HeaderTitle;