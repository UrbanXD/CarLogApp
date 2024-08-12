import React from "react";
import Header from "../../components/Header/Header";
import {theme} from "../../styles/theme";
import HeaderBackButton from "../../components/Header/HeaderBackButton";
import HeaderTitle from "../../components/Header/HeaderTitle";
import {StyleProp, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Avatar} from "react-native-paper";
import countries from "i18n-iso-countries";
import SelectDropdown from 'react-native-select-dropdown'
import CountryFlag from "react-native-country-flag";

const containerStyle: StyleProp<any> = {
    height: "100%",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 2.5,
    backgroundColor: theme.colors.gray3
}

const style = StyleSheet.create({
    leftContainer: {
        ...containerStyle,
        borderBottomEndRadius: 30, borderTopEndRadius: 30
    },
    rightContainer: {
        ...containerStyle,
        flex: 0.30,
        borderBottomStartRadius: 30, borderTopStartRadius: 30
    }
})

const CompetitionHeader: React.FC = () => {
    const countries = require("i18n-iso-countries");
    countries.registerLocale(require("i18n-iso-countries/langs/hu.json"));

    // console.log("price", fuelAPIService.getGasolinePrice(""))

    const countriesName = countries.getNames("hu", {select: "official"});
    const countriesData: any[] = [];
    Object.entries(countriesName).forEach(([key, value]) => {
        countriesData.push({
            code: key,
            title: value
        })
    })

    return (
        <Header
            statusbarColor={ "transparent" }
            backgroundColor={ "transparent" }
        >
            <View style={ style.leftContainer }>
                <HeaderBackButton />
                <View style={{ flexDirection: "column", gap: 0 }}>
                    <HeaderTitle
                        title={ "Üzemanyag árfigyelő" }
                        subAction={
                            <View
                                style={{ flexDirection: "row", gap: 0 }}
                            >
                                <SelectDropdown
                                    data={ countriesData }
                                    search
                                    onSelect={(selectedItem, index) => {
                                        console.log(selectedItem, index);
                                    }}
                                    renderButton={(selectedItem, isOpened) => {
                                        return (
                                            <View style={styles.dropdownButtonStyle}>
                                                {selectedItem && (
                                                    <CountryFlag isoCode={ selectedItem.code } size={ 25 } />                                                )}
                                                <Text style={styles.dropdownButtonTxtStyle}>
                                                    {(selectedItem && selectedItem.title) || 'Select your mood'}
                                                </Text>
                                            </View>
                                        );
                                    }}
                                    renderItem={(item, index, isSelected) => {
                                        return (
                                            <View style={{...styles.dropdownItemStyle, ...(isSelected && {backgroundColor: '#D2D9DF'})}}>
                                                <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
                                                <CountryFlag isoCode={item.code } size={ 25 } />
                                            </View>
                                        );
                                    }}
                                    showsVerticalScrollIndicator={false}
                                    dropdownStyle={styles.dropdownMenuStyle}
                                />
                                {/*<Text style={{ color: 'white', fontSize: hp(2.1), fontFamily: "Gilroy-Medium", alignSelf: "center" }}>Hely: </Text>*/}
                                {/*<TouchableOpacity onPress={() => alert('xd')} style={{ flexDirection: "row", gap: 0, justifyContent: "center", alignItems: "center" }}>*/}
                                {/*    <Text style={{ color: "whitesmoke", fontSize: hp(2.1), fontFamily: "Gilroy-Medium" }}>Szerbia</Text>*/}
                                {/*    <Icon source={"menu-down"} size={ 25 } color={"whitesmoke"} />*/}
                                {/*</TouchableOpacity>*/}
                            </View>
                        }
                        titleStyle={{ color: "white", fontFamily: "Gilroy-Heavy", fontSize: hp(2.75), letterSpacing: wp(5.5) * 0.05 }}
                        // image={ require("../../assets/nb1.png") }
                    />
                </View>
            </View>
            <View style={ style.rightContainer }>
                <TouchableOpacity onPress={ () => alert("profile") }>
                    <Avatar.Text label={"UA"} size={ wp(14) } style={{ backgroundColor: "red" }} />
                </TouchableOpacity>
            </View>
            {/*<HeaderButtonMenu*/}
            {/*    icons={[*/}
            {/*        {*/}
            {/*            icon: "cog",*/}
            {/*            size: 28,*/}
            {/*            iconColor: "whitesmoke",*/}
            {/*            style: {*/}
            {/*                alignSelf: "flex-end"*/}
            {/*            },*/}
            {/*            onPress: () => alert("CsaOG")*/}
            {/*        }*/}
            {/*    ]}*/}
            {/*/>*/}
        </Header>
    )
}

const styles = StyleSheet.create({
    dropdownButtonStyle: {
        width: 200,
        height: 50,
        backgroundColor: '#E9ECEF',
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    dropdownButtonTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: '#151E26',
    },
    dropdownButtonArrowStyle: {
        fontSize: 28,
    },
    dropdownButtonIconStyle: {
        fontSize: 28,
        marginRight: 8,
    },
    dropdownMenuStyle: {
        backgroundColor: '#E9ECEF',
        borderRadius: 8,
    },
    dropdownItemStyle: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
    },
    dropdownItemTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: '#151E26',
    },
    dropdownItemIconStyle: {
        fontSize: 28,
        marginRight: 8,
    },
});

export default CompetitionHeader;