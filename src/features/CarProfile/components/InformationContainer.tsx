import React from "react";
import { ImageSourcePropType, StyleSheet, Text, View } from "react-native";
import Button from "../../../components/Button/Button";
import { FONT_SIZES, ICON_NAMES, SEPARATOR_SIZES } from "../../../constants/constants";
import { Colors } from "../../../constants/colors";
import Icon from "../../../components/Icon";

export interface InformationContainerProps {
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
                                    size={ FONT_SIZES.h3 }
                                    color={ Colors.gray2 }
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
                iconSize={ FONT_SIZES.h3 }
                iconColor={ Colors.gray1 }
                width={ FONT_SIZES.h3 }
                height={ FONT_SIZES.h3 }
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
        backgroundColor: Colors.gray5,
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
        fontSize: FONT_SIZES.p2,
        letterSpacing: FONT_SIZES.p2 * 0.045,
        color: Colors.gray1,
    }
});

export default InformationContainer;