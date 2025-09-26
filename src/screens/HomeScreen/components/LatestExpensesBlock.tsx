import React from "react";
import { Text, View } from "react-native";
import { GLOBAL_STYLE, ICON_NAMES } from "../../../constants/index.ts";
import Link from "../../../components/Link";
import { router } from "expo-router";

const LatestExpensesBlock: React.FC = () => {
    const goToExpensesTab = () => router.push("/(main)/expenses");

    return (
        <View style={ GLOBAL_STYLE.contentContainer }>
            <Text style={ GLOBAL_STYLE.containerTitleText }>
                Legutóbbi kiadások
            </Text>
            <View style={ GLOBAL_STYLE.rowContainer }>

            </View>
            <View style={ GLOBAL_STYLE.rowContainer }>

            </View>
            <View style={ GLOBAL_STYLE.rowContainer }>

            </View>
            <Link
                text="További kiadások"
                icon={ ICON_NAMES.rightArrowHead }
                onPress={ goToExpensesTab }
            />
        </View>
    );
};

export default LatestExpensesBlock;