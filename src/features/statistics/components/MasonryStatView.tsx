import { StatCard, StatCardProps } from "./StatCard.tsx";
import { StyleSheet, View } from "react-native";
import React from "react";
import { SEPARATOR_SIZES } from "../../../constants/index.ts";

type MasonryStatViewProps = {
    column1: Array<StatCardProps>
    column2: Array<StatCardProps>
}

export function MasonryStatView({ column1, column2 }: MasonryStatViewProps) {
    return (
        <View style={ styles.container }>
            <View style={ styles.column }>
                {
                    column1.map((cardProps, index) => (
                        <StatCard key={ index } { ...cardProps } />
                    ))
                }
            </View>
            <View style={ styles.column }>
                {
                    column2.map((cardProps, index) => (
                        <StatCard key={ index } { ...cardProps } />
                    ))
                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        gap: SEPARATOR_SIZES.lightSmall
    },
    column: {
        flex: 1,
        gap: SEPARATOR_SIZES.lightSmall
    }
});