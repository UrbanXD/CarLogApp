import React from "react";
import { ImageSourcePropType, StyleSheet, Text, View } from "react-native";
import Button from "../../Button/components/Button";
import { FONT_SIZES, ICON_NAMES, SEPARATOR_SIZES } from "../../Shared/constants/constants";
import { theme } from "../../Shared/constants/theme";
import Icon from "../../Shared/components/Icon";

interface InformationContainerProps {
    data: Array<{ icon?: string | ImageSourcePropType; text: string }>
    onEdit?: () => void
}

const InformationContainer: React.FC<InformationContainerProps> = ({
    data,
    onEdit
}) =>
    <View style={ styles.container }>
        <View style={ styles.informationContainer }>
            {
                data.map(
                    (element, index) =>
                        <View key={ index } style={ styles.contentContainer }>
                            {
                                element.icon &&
                                <Icon
                                    icon={ element.icon }
                                    size={ FONT_SIZES.medium }
                                    color={ theme.colors.gray2 }
                                />
                            }
                            <Text
                                style={ styles.text }
                                numberOfLines={ 2 }
                            >
                                { element.text }
                            </Text>
                        </View>
                )
            }
        </View>
        {
            onEdit &&
            <Button.Icon
                icon={ ICON_NAMES.pencil }
                iconSize={ FONT_SIZES.medium }
                iconColor={ theme.colors.gray1 }
                width={ FONT_SIZES.medium }
                height={ FONT_SIZES.medium }
                backgroundColor="transparent"
                onPress={ onEdit }
            />
        }
    </View>

const styles = StyleSheet.create({
    container: {
        flexShrink: 1,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: theme.colors.gray5,
        paddingHorizontal: SEPARATOR_SIZES.lightSmall,
        paddingVertical: SEPARATOR_SIZES.small,
        borderRadius: 15
    },
    informationContainer: {
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        gap: SEPARATOR_SIZES.lightSmall
    },
    contentContainer: {
        flexGrow: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: SEPARATOR_SIZES.lightSmall,
    },
    text: {
        flexShrink: 1,
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.intermediate,
        letterSpacing: FONT_SIZES.intermediate * 0.045,
        color: theme.colors.gray1,
    }
});

export default InformationContainer;