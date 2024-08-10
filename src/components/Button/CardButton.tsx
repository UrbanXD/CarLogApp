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
    StyleSheet, useWindowDimensions
} from "react-native";
import {theme} from "../../styles/theme";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';


interface CardButtonProp {
    title?: string,
    subtitle?: string,
    image?: ImageSourcePropType,
    onPress: () => void
}

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

const style = StyleSheet.create({
    buttonContainer: {
        flex: 1,
        width: "100%",
        flexDirection:"row",
        alignItems:'center',
        justifyContent:'center',
        padding: 10,
        backgroundColor: theme.colors.primaryBackground6,
        borderColor: theme.colors.primaryBackground2,
        borderStyle: 'solid',
        borderWidth: 2,
        borderRadius: 20,
    },
    buttonContent: {
    },
    image: {
        flex: 1,
        resizeMode: "contain",
        alignSelf: "center",
        width: Dimensions.get("window").width < 500 ? wp(35) - 35 : wp(15) - 35,
        height: Dimensions.get("window").width < 500 ? wp(35) - 35 : wp(15) - 35,
    },
    title: {
        alignSelf: "center",
        color: "whitesmoke",
        fontSize: hp(2.75),
        letterSpacing: hp(2.75) * 0.01,
        fontFamily: "Gilroy-Heavy",
        // fontWeight: "bold",
        textAlign: "center",
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 15
    }
})

export default CardButton;