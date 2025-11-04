import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { formTheme } from "../../../../ui/form/constants/theme.ts";
import SearchBar from "../../../SearchBar.tsx";
import { COLORS, FONT_SIZES, ICON_NAMES, SEPARATOR_SIZES } from "../../../../constants/index.ts";
import Divider from "../../../Divider.tsx";

type DropdownPickerSearchBarProps = {
    title?: string
    searchTerm: string
    setSearchTerm: (searchTerm: string) => void
    searchBarEnabled: boolean
    searchBarPlaceholder?: string
}

export function DropdownPickerHeader({
    title,
    searchTerm,
    setSearchTerm,
    searchBarEnabled,
    searchBarPlaceholder
}: DropdownPickerSearchBarProps) {
    return (
        <View style={ styles.container }>
            {
                title &&
               <Text style={ styles.title }>{ title }</Text>
            }
            {
                searchBarEnabled &&
               <>
                  <SearchBar
                     term={ searchTerm }
                     setTerm={ setSearchTerm }
                     textInputProps={ {
                         placeholder: searchBarPlaceholder,
                         actionIcon: ICON_NAMES.close,
                         onAction: () => setSearchTerm(""),
                         containerStyle: {
                             backgroundColor: COLORS.gray4,
                             borderRadius: 15
                         }
                     } }
                  />
                  <Divider
                     margin={ 0 }
                     size={ "85%" }
                     color={ formTheme.activeColor }
                  />
               </>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        alignSelf: "center",
        gap: SEPARATOR_SIZES.lightSmall,
        paddingBottom: SEPARATOR_SIZES.lightSmall
    },
    title: {
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.p1,
        color: COLORS.white,
        textAlign: "center"
    },

    button: {
        borderWidth: 2,
        borderColor: COLORS.fuelYellow
    }
});