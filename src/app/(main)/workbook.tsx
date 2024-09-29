import React from "react";
import { Text, View } from "react-native";
import { theme } from "../../constants/theme";

const Page: React.FC = () => {
    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.black2 }}>
            <Text>WORK</Text>
        </View>
    )
}

export default Page;