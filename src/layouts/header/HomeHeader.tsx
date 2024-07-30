import React from "react";
import Header from "../../components/Header/Header";
import {theme} from "../../styles/theme";
import HeaderButtonMenu from "../../components/Header/HeaderButtonMenu";

const HomeHeader: React.FC = () => {
    return (
        <Header statusbarColor={ theme.colors.primaryBackground2 } backgroundColor="transparent">
            <HeaderButtonMenu
                icons={[
                    {
                        icon: "cog",
                        size: 28,
                        iconColor: theme.colors.secondaryColor1,
                        style: {
                            alignSelf: "flex-end"
                        },
                        onPress: () => alert("CsaOG")
                    }
                ]}
            />
        </Header>
    )
}

export default HomeHeader;