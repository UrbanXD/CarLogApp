import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { FONT_SIZES, GLOBAL_STYLE } from "../../../constants/constants";
import { theme } from "../../../constants/theme";
import { useSession } from "../../../features/Auth/context/SessionProvider.tsx";
import useAuth from "../../../hooks/useAuth.tsx";

const WelcomeBlock: React.FC = () => {
    const { session } = useSession();
    const {changeEmail} = useAuth();

    return (
        <View
            style={ styles.titleContainer }
        >
            <Text style={ styles.welcomeText} onPress={() => changeEmail("urbanadam6996@gmail.com")}>
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
        fontSize: FONT_SIZES.h2,
        letterSpacing: FONT_SIZES.h2 * 0.045,
        color: theme.colors.white,
        textTransform: "uppercase"
    },
    infoText: {
        fontFamily: "Gilroy-Mediun",
        fontSize: FONT_SIZES.p2,
        letterSpacing: FONT_SIZES.p2 * 0.05,
        color: theme.colors.gray1
    }
})

export default WelcomeBlock;