import React from "react";
import {
    Dimensions,
    Image,
    ImageSourcePropType,
    ImageStyle,
    StyleProp,
    TouchableOpacity,
    View,
    Text,
    StyleSheet
} from "react-native";
import {theme} from "../styles/theme";

interface CardButtonProp {
    title?: string,
    subtitle?: string,
    image?: ImageSourcePropType,
    onPress: () => void
}
const style = StyleSheet.create({
    buttonContainer: {
        flexDirection:"row",
        alignItems:'center',
        justifyContent:'center',
        width: ( Dimensions.get("window").width / 2 ) - 35,
        height: ( Dimensions.get("window").width / 1.65 ) - 35,
        padding: 10,
        backgroundColor: theme.colors.secondaryColor2,
        borderColor: theme.colors.secondaryBlue,
        borderStyle: 'solid',
        borderWidth: 2,
        borderRadius: 20,
        transform: [{
            rotate: "10deg"
        }]
    },
    buttonContent: {
        transform: [{
            rotate: "-10deg"
        }]
    },
    image: {
        flex: 1,
        resizeMode: "contain",
        alignSelf: "center",
        width: ( Dimensions.get("window").width / 2.5) - 35,
    },
    title: {
        alignSelf: "center",
        color: "whitesmoke",
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 15
    }
})

const CardButton: React.FC<CardButtonProp> = ({ title, subtitle, image, onPress }) => {
    return (
        <TouchableOpacity style={ style.buttonContainer } onPress={ onPress }>
            <View style={ style.buttonContent }>
                {
                    image
                        ? <Image
                            source={ image }
                            resizeMode="cover"
                            style={ style.image }
                          />
                        : <></>
                }
                {
                    title
                        ? <Text style={ style.title }>{ title }</Text>
                        : <></>
                }
            </View>
        </TouchableOpacity>
    )
}

export default CardButton;