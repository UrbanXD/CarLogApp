import React from "react";
import { StatusBar, Text, View } from "react-native";
import { theme } from "../../../../constants/theme";
import useHeaderStyles from "../../hooks/useHeaderStyles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Button from "../../../../components/Button/Button";
import { FONT_SIZES, GLOBAL_STYLE, ICON_FONT_SIZE_SCALE, ICON_NAMES } from "../../../../constants/constants";
import { router } from "expo-router";

interface SecondaryHeaderProps {
    title?: string
}

const SecondaryHeader: React.FC<SecondaryHeaderProps> = ({
    title
}) => {
    const { top } = useSafeAreaInsets();
    const styles = useHeaderStyles(top);

    return (
        <View style={ styles.wrapper }>
            <StatusBar
                barStyle="light-content"
                backgroundColor={ GLOBAL_STYLE.pageContainer.backgroundColor }
            />
            <View style={ styles.barContainer }>
                <Button.Icon
                    icon={ ICON_NAMES.leftArrow }
                    iconSize={ FONT_SIZES.p1 * ICON_FONT_SIZE_SCALE }
                    iconColor={ theme.colors.white }
                    width={ FONT_SIZES.p1 * ICON_FONT_SIZE_SCALE }
                    height={ FONT_SIZES.p1 * ICON_FONT_SIZE_SCALE }
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