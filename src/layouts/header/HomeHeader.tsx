import React from "react";
import Header from "../../components/Header/Header";
import {theme} from "../../styles/theme";
import HeaderButtonMenu from "../../components/Header/HeaderButtonMenu";
import {FONT_SIZES} from "../../constants/constants";
import HeaderTitle from "../../components/Header/HeaderTitle";
import {Text, View} from "react-native";
import {Avatar} from "react-native-paper";

const HomeHeader: React.FC = () => {
    return (
        <Header statusbarColor={ theme.colors.primaryBackground4 } backgroundColor="transparent">
            <View style={{ flex: 1 }}>
                <Text style={{ color: "white", fontFamily: "Gilroy-Heavy", fontSize: FONT_SIZES.medium, letterSpacing: FONT_SIZES.medium * 0.1 }}>CARLOG</Text>
            </View>
            <View style={{ flex: 1, alignItems: "flex-end" }}>
                <Avatar.Text label={"UA"} size={FONT_SIZES.large * 1.25} />
            </View>
            {/*<HeaderButtonMenu*/}
            {/*    containerStyle={{*/}
            {/*        flex: 1,*/}
            {/*        alignItems: "flex-end"*/}
            {/*    }}*/}
            {/*    icons={[*/}
            {/*        {*/}
            {/*            icon: "cog",*/}
            {/*            size: FONT_SIZES.medium,*/}
            {/*            iconColor: theme.colors.grayLight,*/}
            {/*            onPress: () => alert("CsaOG")*/}
            {/*        }*/}
            {/*    ]}*/}
            {/*/>*/}
        </Header>
    )
}

export default HomeHeader;