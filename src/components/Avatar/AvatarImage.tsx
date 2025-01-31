import React from "react";
import { Image, TouchableOpacity, StyleSheet, ViewStyle, StyleProp } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

interface AvatarImageProps {
    avatarSize?: number
    style?: StyleProp<ViewStyle>
}

const AvatarImage: React.FC<AvatarImageProps> = ({
    avatarSize = hp(5),
    style
}) => {
    const styles = useStyles(avatarSize);

    return (
        <TouchableOpacity
            style={ [styles.container, style] }
        >
            <Image
                source={ require("../../assets/images/google_logo.png") }
                style={ styles.image }
            />
        </TouchableOpacity>
    )
}

const useStyles = (avatarSize: number) => {
    return StyleSheet.create({
        container: {
            width: avatarSize,
            height: avatarSize,
            borderRadius: avatarSize / 2,
        },
        image: {
            width: avatarSize,
            height: avatarSize,
            resizeMode: "cover",
        }
    })
}

export default AvatarImage;