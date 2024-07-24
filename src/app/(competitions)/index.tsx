import {Dimensions, ImageBackground, NativeScrollEvent, NativeUIEvent, ScrollView, Text, View} from 'react-native';
import TableScreen from "../../screens/TableScreen";
import { useLocalSearchParams } from "expo-router";
import { useCompetition } from "../../providers/CompetitionProvider";
import React, {useEffect, useRef, useState} from "react";
import {theme} from "../../styles/theme";
import {LinearGradient} from "expo-linear-gradient";
import {BlurView} from "expo-blur";
import Animated from 'react-native-reanimated';
import CustomScrollView from "../../components/CustomScrollView/CustomScrollView";
import {ScrollViewProvider} from "../../providers/ScrollViewProvider";
const Tab: React.FC = () => {
    const { setCompetition, setSeason } = useCompetition();
    const {
        competition,
        season,
    } = useLocalSearchParams<{ competition?: string, season?: string }>();

    useEffect(() => {
        setCompetition(competition);
        setSeason(season);
    }, [competition, season, setCompetition, setSeason]);

    return (
            <CustomScrollView>
                <ImageBackground
                    source={ require("../../assets/bg1-small.jpg") }
                    resizeMode={"cover"}
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        height: "100%",
                        width: 1800,
                    }}
                />
                <BlurView
                    intensity={5}
                    style={{
                        backgroundColor: "rgba(255,255,255,0.25)",
                        flexDirection: "column",
                        alignContent: "center"
                    }}
                >
                    <View
                        style={{
                            marginVertical: 200,
                            marginHorizontal: 5,
                            backgroundColor: theme.colors.primaryBackground2,
                            borderRadius: 20
                        }}
                    >
                        <TableScreen />
                    </View>
                </BlurView>
            </CustomScrollView>
    );
}

export default Tab;