import React from "react";
import {StatusBar, Text, View} from "react-native";
import {theme} from "../../constants/theme";
import useStyles from "./constants/useStyles";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import Button from "../../../Button/components/Button";
import {FONT_SIZES, ICON_FONT_SIZE_SCALE, ICON_NAMES} from "../../constants/constants";
import {router} from "expo-router";

interface SecondaryHeaderProps {
    title?: string
}

const SecondaryHeader: React.FC<SecondaryHeaderProps> = ({
    title
}) => {
    const { top } = useSafeAreaInsets();
    const styles = useStyles(top)

    return (
        <View style={ styles.wrapper }>
            <StatusBar
                barStyle="light-content"
                backgroundColor={ theme.colors.black2 }
            />
            <View style={ styles.barContainer }>
                <Button.Icon
                    icon={ ICON_NAMES.leftArrow }
                    iconSize={ FONT_SIZES.normal * ICON_FONT_SIZE_SCALE }
                    iconColor={ theme.colors.white }
                    width={ FONT_SIZES.normal * ICON_FONT_SIZE_SCALE }
                    height={ FONT_SIZES.normal * ICON_FONT_SIZE_SCALE }
                    backgroundColor="transparent"
                    onPress={ () => router.back() }
                />
                {
                    title &&
                    <Text style={ styles.title } numberOfLines={ 1 }>
                        { title }
                    </Text>
                }
            </View>
        </View>
    )
}

export default SecondaryHeader;