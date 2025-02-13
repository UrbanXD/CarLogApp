import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { FONT_SIZES, GLOBAL_STYLE } from "../../../constants/constants";
import { theme } from "../../../constants/theme";
import { useSession } from "../../../features/Auth/context/SessionProvider.tsx";

const WelcomeBlock: React.FC = () => {
    const { session } = useSession();

    return (
        <View
            style={ styles.titleContainer }
        >
            <Text style={ styles.welcomeText}>
                Üdv { `${ session?.user.user_metadata.firstname ?? "" } ${ session?.user.user_metadata?.lastname ?? "" }` }!
            </Text>
            <Text style={ styles.infoText }>
                Vezzessen számot nálunk az autóiról!
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    titleContainer: {
        ...GLOBAL_STYLE.contentContainer,
        paddingHorizontal: 0,
        paddingVertical: 0,
        gap: 0,
        backgroundColor: "transparent"
    },
    welcomeText: {
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.medium,
        letterSpacing: FONT_SIZES.medium * 0.045,
        color: theme.colors.white,
        textTransform: "uppercase"
    },
    infoText: {
        fontFamily: "Gilroy-Mediun",
        fontSize: FONT_SIZES.intermediate,
        letterSpacing: FONT_SIZES.intermediate * 0.05,
        color: theme.colors.gray1
    }
})

export default WelcomeBlock;