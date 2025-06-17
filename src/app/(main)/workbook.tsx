import React from "react";
import { Text, View } from "react-native";
import { COLORS } from "../../constants/index.ts";

const Page: React.FC = () => {
    return (
        <View style={{ flex: 1, backgroundColor: COLORS.black2 }}>
            <Text>WORK</Text>
        </View>
    )
}

export default Page;