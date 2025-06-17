import React from "react";
import { COLORS } from "../../../constants/index.ts";
import WelcomeBlock from "./WelcomeBlock";
import MyGarageBlock from "./MyGarageBlock";
import UpcomingRidesBlock from "./UpcomingRidesBlock";
import Divider from "../../../components/Divider";
import LatestExpensesBlock from "./LatestExpensesBlock";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { ScreenScrollView } from "../../../features/ScreenScrollView/components/ScreenScrollView.tsx";

const HomeScreen: React.FC = () =>
    <ScreenScrollView>
        <WelcomeBlock />
        <Divider
            thickness={ 2.5 }
            size={ wp(75) }
            color={ COLORS.gray4 }
        />
        <MyGarageBlock />
        <UpcomingRidesBlock />
        <LatestExpensesBlock />
    </ScreenScrollView>

export default HomeScreen;