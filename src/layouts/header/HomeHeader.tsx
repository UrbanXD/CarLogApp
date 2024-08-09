import React from "react";
import Header from "../../components/Header/Header";
import {theme} from "../../styles/theme";
import HeaderButtonMenu from "../../components/Header/HeaderButtonMenu";
import {FONT_SIZES} from "../../constants/constants";
import HeaderTitle from "../../components/Header/HeaderTitle";

const HomeHeader: React.FC = () => {
    return (
        <Header statusbarColor={ theme.colors.primaryBackground4 } backgroundColor="transparent">
            <HeaderButtonMenu
                containerStyle={{
                    flex: 1,
                    alignItems: "flex-end"
                }}
                icons={[
                    {
                        icon: "cog",
                        size: FONT_SIZES.medium,
                        iconColor: theme.colors.grayLight,
                        onPress: () => alert("CsaOG")
                    }
                ]}
            />
        </Header>
    )
}

export default HomeHeader;