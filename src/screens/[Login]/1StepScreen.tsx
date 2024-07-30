import React from "react";
import {KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Animated, {LightSpeedInLeft, LightSpeedInRight, SlideInDown} from "react-native-reanimated";
import {GLOBAL_STYLE, ICON_NAMES} from "../../constants/constants";
import {TextInput} from "react-native-paper";
import InputText from "../../components/Form/InputText";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from 'zod'
import {theme} from "../../styles/theme";
import TextDivider from "../../components/TextDivider/TextDivider";
import Button from "../../components/Button/Button";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";

const Step1Screen: React.FC = () => {
    const formSchema = z.object({
        email: z.string().email('Please enter a valid email'),
        password: z.string().min(8, 'Password must be at least 8 characters'),
    });

    const { control, handleSubmit } = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
        resolver: zodResolver(formSchema),
    });
    return (
        <Animated.View entering={ SlideInDown.duration(750) } style={ styles.container }>
            <View style={ GLOBAL_STYLE.formContainer }>
                <InputText
                    control={ control }
                    fieldName="email"
                    fieldNameText="Email cím"
                    icon={ ICON_NAMES.email }
                    placeholder="Email"
                />
                <InputText
                    control={ control }
                    fieldName="password"
                    fieldNameText="Jelszó"
                    icon={ ICON_NAMES.password }
                    placeholder="Jelszó"
                    isSecure={ true }
                />
                <Text style={ GLOBAL_STYLE.formLinkText }>Elfelejtette jelszavát?</Text>
                <Button title="Bejelentkezés" onPress={ () => 1 } />
                <TextDivider title="vagy" color={ theme.colors.grayLight } lineHeight={ 1 } marginVertical={ GLOBAL_STYLE.formContainer.gap }/>
                <Button onPress={ () => 1 } title="Folytatás Google fiókkal"  icon={require("../../assets/google_logo.png")} inverse={true} backgroundColor={ theme.colors.white } textColor={ theme.colors.googleRed } textStyle={{ fontSize: hp(2) }} />
                <Button onPress={ () => 1 } title="Folytatás Facebook fiókkal" icon={require("../../assets/facebook_logo.png")} backgroundColor={ theme.colors.facebookBlue } textColor={ theme.colors.white } textStyle={{ fontSize: hp(2) }} />
            </View>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderTopLeftRadius: 125,
        shadowColor: GLOBAL_STYLE.formContainer.backgroundColor,
        elevation: 10,
    }
})

export default Step1Screen;