import React from "react";
import TextButton from "../TextButton";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { theme } from "../../../constants/theme";
import useAuth from "../../../hooks/useAuth.tsx";

export const GoogleButton: React.FC = () => {
    const { googleAuth } = useAuth();

    return (
        <TextButton
            text="Folytatás Google fiókkal"
            fontSize={ hp(2.35) }
            textColor={ theme.colors.googleRed }
            backgroundColor={ theme.colors.white }
            iconLeft={ require("../../../assets/images/google_logo.png") }
            onPress={ googleAuth }
        />
    )
}