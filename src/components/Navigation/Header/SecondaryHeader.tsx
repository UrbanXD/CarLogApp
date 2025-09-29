import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Button from "../../Button/Button.ts";
import { COLORS, FONT_SIZES, ICON_FONT_SIZE_SCALE, ICON_NAMES } from "../../../constants/index.ts";
import { router } from "expo-router";
import HeaderView from "./HeaderView.tsx";

interface SecondaryHeaderProps {
    title?: string;
}

const SecondaryHeader: React.FC<SecondaryHeaderProps> = ({
    title
}) =>
    <HeaderView>
        <Button.Icon
            icon={ ICON_NAMES.leftArrow }
            iconSize={ FONT_SIZES.p1 * ICON_FONT_SIZE_SCALE }
            iconColor={ COLORS.white }
            width={ FONT_SIZES.p1 * ICON_FONT_SIZE_SCALE }
            height={ FONT_SIZES.p1 * ICON_FONT_SIZE_SCALE }
            backgroundColor="transparent"
            onPress={ () => router.back() }
        />
        {
            title &&
           <View style={ styles.titleContainer }>
              <Text style={ styles.title } numberOfLines={ 1 } adjustsFontSizeToFit>
                  { title }
              </Text>
           </View>
        }
    </HeaderView>;

const styles = StyleSheet.create({
    titleContainer: {
        flex: 1,
        alignItems: "flex-end",
        justifyContent: "center"
    },
    title: {
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.h3,
        color: COLORS.white,
        letterSpacing: FONT_SIZES.h3 * 0.05
    }
});

export default SecondaryHeader;