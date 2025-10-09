import { InfoRow, InfoRowProps } from "./InfoRow.tsx";
import React from "react";
import { StyleSheet, View } from "react-native";
import Divider from "../Divider.tsx";
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";
import { COLORS, SEPARATOR_SIZES } from "../../constants/index.ts";
import { Color } from "../../types/index.ts";

type InfoContainerProps = {
    data: Array<InfoRowProps>
    maxItemInRow?: number
    flexDirection?: "row" | "column"
    dividerColor?: Color
    dividerMargin?: number
}

export function InfoContainer({
    data,
    maxItemInRow = 1,
    flexDirection = "row",
    dividerColor = COLORS.gray3,
    dividerMargin = SEPARATOR_SIZES.lightSmall / 3
}: InfoContainerProps) {
    const rows: Array<Array<InfoRowProps>> = [];

    for(let i = 0; i < data.length; i += (flexDirection === "row" ? 1 : maxItemInRow)) {
        rows.push(data.slice(i, i + (flexDirection === "row" ? 1 : maxItemInRow)));
    }

    return (
        <View style={ styles.container }>
            {
                rows.map((row, rowIndex) => {
                    const itemWidth = `${ 100 / row.length }%`;

                    return (
                        <React.Fragment key={ rowIndex }>
                            <View style={ styles.infoContainer }>
                                {
                                    row.map((item, index) => (
                                        <React.Fragment key={ index }>
                                            <InfoRow
                                                { ...item }
                                                containerStyle={ [
                                                    { width: itemWidth },
                                                    flexDirection === "row"
                                                    ? styles.infoContainer.row
                                                    : styles.infoContainer.column,
                                                    item.containerStyle
                                                ] }
                                                titleStyle={ [
                                                    flexDirection === "row"
                                                    ? styles.infoContainer.row.title
                                                    : styles.infoContainer.column.title,
                                                    item.titleStyle
                                                ] }
                                                subtitleStyle={ [
                                                    flexDirection === "row"
                                                    ? styles.infoContainer.row.subtitle
                                                    : styles.infoContainer.column.subtitle,
                                                    item.subtitleStyle
                                                ] }
                                            />

                                            {
                                                index < row.length - 1 &&
                                               <Divider
                                                  isVertical
                                                  color={ dividerColor }
                                                  size={ heightPercentageToDP(4) }
                                                  margin={ dividerMargin }
                                               />
                                            }
                                        </React.Fragment>
                                    ))
                                }
                            </View>
                            {
                                rowIndex < rows.length - 1 &&
                               <Divider
                                  color={ dividerColor }
                                  size={ flexDirection === "column" ? widthPercentageToDP(40) : "100%" }
                                  margin={ dividerMargin }
                               />

                            }
                        </React.Fragment>
                    );
                })
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: SEPARATOR_SIZES.lightSmall
    },
    infoContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",

        row: {
            flexDirection: "row",
            alignItems: "center",
            height: "100%",

            title: {
                textAlign: "left"
            },

            subtitle: {
                textAlign: "left"
            }
        },

        column: {
            flexDirection: "column",

            title: {
                textAlign: "center"
            },

            subtitle: {
                textAlign: "center"
            }
        }
    }
});