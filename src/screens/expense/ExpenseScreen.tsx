import { useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback } from "react";
import { COLORS, SEPARATOR_SIZES } from "../../constants/index.ts";
import { ScreenScrollView } from "../../components/screenView/ScreenScrollView.tsx";
import { Title } from "../../components/Title.tsx";

export function ExpenseScreen() {
    const { id } = useLocalSearchParams();

    useFocusEffect(
        useCallback(() => {
            console.log("id", id);
            // const getOdometerLog = async () => {
            //     const log = await odometerLogDao.getById(id);
            //     setOdometerLog(log ?? null);
            // };
            //
            // getOdometerLog();
        }, [id])
    );

    return (
        <>
            <ScreenScrollView screenHasTabBar={ false } style={ { paddingBottom: SEPARATOR_SIZES.small } }>
                <Title
                    title={ "TITLEse " }
                    dividerStyle={ {
                        backgroundColor: COLORS.gray2,
                        marginBottom: SEPARATOR_SIZES.normal
                    } }
                />
            </ScreenScrollView>
        </>
    );
}