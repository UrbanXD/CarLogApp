import React from "react";
import Header from "../../components/Header/Header";
import {theme} from "../../styles/theme";
import HeaderButtonMenu from "../../components/Header/HeaderButtonMenu";
import {FONT_SIZES} from "../../constants/constants";

const HomeHeader: React.FC = () => {
    return (
        <Header statusbarColor={ theme.colors.primaryBackground2 } backgroundColor="transparent">
            <HeaderButtonMenu
                icons={[
                    {
                        icon: "cog",
                        size: FONT_SIZES.medium,
                        iconColor: theme.colors.secondaryColor1,
                        onPress: () => alert("CsaOG")
                    }
                ]}
            />
        </Header>
    )
}

export default HomeHeader;