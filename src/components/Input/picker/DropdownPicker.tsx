import React from "react";
import DropdownPickerController from "./DropdownPickerController.tsx";
import DropdownPickerElements from "./DropdownPickerElements.tsx";
import {
    DropdownPickerProvider,
    DropdownPickerProviderProps
} from "../../../contexts/dropdownPicker/DropdownPickerProvider.tsx";
import { StyleSheet, View } from "react-native";

const DropdownPicker: React.FC<DropdownPickerProviderProps> = (props) => {
    return (
        <DropdownPickerProvider value={ props }>
            <View style={ props.horizontal && styles.horizontalContainer }>
                <DropdownPickerController/>
                <DropdownPickerElements/>
            </View>
        </DropdownPickerProvider>
    );
};

const styles = StyleSheet.create({
    horizontalContainer: {
        flex: 1,
        flexDirection: "row"
    }
});

export default DropdownPicker;