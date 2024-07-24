import React, {useEffect} from "react";
import Standing from "../components/standing/Standing";
import {ActivityIndicator, View, Text, Dimensions} from "react-native";
import {useCompetition} from "../providers/CompetitionProvider";
import {store, RootState} from "../redux/store";
import {useDispatch, useSelector} from "react-redux";
import {fetchCompetitionByNameAndSeason} from "../redux/reducers/competition/competition.slices";
import {LeagueInterface} from "../interfaces";

const TableScreen: React.FC = () => {
    let { competition, season } = useCompetition();
    const dispatch = useDispatch();

    const standing = useSelector<RootState>(state => state.competition.competition) as LeagueInterface;
    const isLoading = useSelector<RootState>(state => state.competition.isLoading);

    useEffect(() => {
        if (competition && season) {
            store.dispatch(fetchCompetitionByNameAndSeason({type: "league" , name: competition, season }))
        }
    }, [dispatch, competition, season]);

    return (
        <View style={{
            minHeight: Dimensions.get("screen").height,
            backgroundColor: "transparent"
        }}>
            {
                !isLoading
                    ? (
                        standing.standings?.length > 0
                            ? <Standing name={standing.name} season={standing.season} standings={standing.standings} logo={standing.logo}></Standing>
                            : <Text>Sikertelen</Text>
                    )
                    : (
                        <ActivityIndicator animating={true} size="large" />
                    )
            }
        </View>
    )
}

export default TableScreen;