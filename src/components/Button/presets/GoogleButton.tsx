import React from "react";
import TextButton from "../TextButton";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Colors } from "../../../constants/colors/Colors.ts";
import { useUserManagement } from "../../../hooks/useUserManagement.ts";

export const GoogleButton: React.FC = () => {
    const { googleAuth } = useUserManagement();

    return (
        <TextButton
            text="Folytatás Google fiókkal"
            fontSize={ hp(2.35) }
            textColor={ Colors.googleRed }
            backgroundColor={ Colors.white }
            iconLeft={ require("../../../assets/images/google_logo.png") }
            onPress={ googleAuth }
        />
    )
}