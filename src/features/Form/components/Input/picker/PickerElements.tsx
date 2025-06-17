import React, { useEffect, useRef } from "react";
import { PickerDataType } from "./Picker";
import { FlatList } from "react-native-gesture-handler";
import PickerItem from "./PickerItem";
import { StyleSheet, Text, View } from "react-native";
import {
    DEFAULT_SEPARATOR,
    FONT_SIZES,
    GLOBAL_STYLE,
    ICON_NAMES,
    SEPARATOR_SIZES
} from "../../../../../constants/constants";
import { Colors } from "../../../../../constants/colors";
import SearchBar from "../../../../../components/SearchBar";
import Icon from "../../../../../components/Icon";
import {heightPercentageToDP} from "react-native-responsive-screen";

interface PickerElementsProps {
    data: Array<PickerDataType>
    selectedItemID?: string
    onSelect: (id: string) => void
    isHorizontal?: boolean
    isCarousel?: boolean
    searchTerm?: string
    setSearchTerm?: (value: string) => void
    isDropdown?: boolean
    isDropdownContentVisible: boolean
    setIsDropdownContentVisible: React.Dispatch<React.SetStateAction<boolean>>
}

const PickerElements: React.FC<PickerElementsProps> = ({
    data,
    onSelect,
    selectedItemID,
    searchTerm,
    setSearchTerm,
    isDropdown,
    isHorizontal,
    isCarousel,
    isDropdownContentVisible,
    setIsDropdownContentVisible
}) => {
    const flatListRef = useRef<FlatList>(null);

    const select = (id: string) => {
        onSelect(id);
        setIsDropdownContentVisible(false);
    }

    const renderItem = (arg: { item: any, index: number }) =>
        <React.Fragment key={ arg.index }>
            <PickerItem
                title={ arg.item.title }
                subtitle={ arg.item.subtitle }
                icon={ arg.item.icon }
                selected={ arg.item.id === selectedItemID }
                onPress={ () => select(arg.item.id || arg.index.toString() ) }
            />
            {
                isHorizontal && isCarousel && arg.index === (data.length - 1) &&
                <View style={ styles.separator } />
            }
        </React.Fragment>

    const keyExtractor = (item: any, index: number) => item.id || index.toString();

    const onScrollToIndexFailed = (info: any) => {
        setTimeout(() => {
            flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
        }, 100);
    }

    useEffect(() => {
        if(isDropdownContentVisible && data.length >= 1) {
            const selectedItemIndex = data.map(item => item.id).indexOf(selectedItemID);

            if(selectedItemIndex !== -1) {
                flatListRef?.current?.scrollToIndex({
                    index: selectedItemIndex,
                    animated: true
                })
            } else {
                flatListRef?.current?.scrollToIndex({
                    index: 0,
                    animated: false
                })
            }
        }

    }, [isDropdownContentVisible, data]);

    return (
        <View style={[styles.elementsContainer, !isHorizontal && { maxHeight: heightPercentageToDP(32.5), flexDirection: "column" }]}>
            {
                !setSearchTerm && isDropdown &&
                <Icon
                    icon={ ICON_NAMES.close }
                    size={ FONT_SIZES.p1 }
                    color={ Colors.white }
                    style={{ alignSelf: "center" }}
                    onPress={ () => setIsDropdownContentVisible(!isDropdownContentVisible) }
                />
            }
            {
                setSearchTerm &&
                <SearchBar
                    term={ searchTerm }
                    onTextChange={ (value) => setSearchTerm(value) }
                    onClose={ () => setIsDropdownContentVisible(!isDropdownContentVisible) }
                />
            }
            {
                isCarousel
                    ?   data.length >= 1
                        ?   <FlatList
                                ref={ flatListRef }
                                data={ data }
                                renderItem={ renderItem }
                                keyExtractor={ keyExtractor }
                                horizontal={ isHorizontal }
                                showsHorizontalScrollIndicator={ false }
                                contentContainerStyle={ styles.elementsScrollViewContainer }
                                onScrollToIndexFailed={ onScrollToIndexFailed }
                                removeClippedSubviews
                            />
                        :   <View style={ styles.notFoundContainer }>
                                <Text style={ styles.notFoundText }>Nem található</Text>
                            </View>
                    :   <View style={ styles.notCarouselElementsContainer }>
                            {
                                data.map((item, index) => {
                                    return renderItem({ item, index });
                                })
                            }
                        </View>
            }
        </View>
    )
}

const styles= StyleSheet.create({
    elementsContainer: {
        flex: 1,
        flexDirection: "row",
        gap: SEPARATOR_SIZES.lightSmall,
        overflow: "hidden"
    },
    elementsScrollViewContainer: {
        gap: SEPARATOR_SIZES.small
    },
    separator: {
        flex: 1,
        width: DEFAULT_SEPARATOR
    },
    notFoundContainer: {
        flexGrow: 0.8,
        justifyContent: "center"
    },
    notFoundText: {
        ...GLOBAL_STYLE.containerText,
        textAlign: "center",
    },
    notCarouselElementsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: SEPARATOR_SIZES.small
    }
})

export default PickerElements;