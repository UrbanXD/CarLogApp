import React, {ReactNode} from "react";
import {StyleSheet, View} from "react-native";
import {SEPARATOR_SIZES} from "../../../../constants/constants";

interface InputGroupProps {
    children?: ReactNode;
}

const InputGroup: React.FC<InputGroupProps> = ({
    children
}) => {
    return (
        <View style={ styles.container }>
            { children }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: SEPARATOR_SIZES.small
    }
})

export default InputGroup;