import React from "react";
import { Text, View } from "react-native";
import { GLOBAL_STYLE, ICON_NAMES } from "../../../constants/index.ts";
import Link from "../../../components/Link";

const LatestExpensesBlock: React.FC = () => {
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
            />
        </View>
    )
}

export default LatestExpensesBlock;