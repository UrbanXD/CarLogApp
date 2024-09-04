import React, { forwardRef, ReactNode, useCallback } from "react";
import { StyleSheet, View, Text } from "react-native";
import { theme } from "../../constants/theme";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { DEFAULT_SEPARATOR, FONT_SIZES, GLOBAL_STYLE, SEPARATOR_SIZES } from "../../constants/constants";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import Constants from 'expo-constants';
import {snapPoint} from "@gorhom/bottom-sheet/lib/typescript/utilities/snapPoint";

type BottomSheetProps = {
    title?: string
    children?: ReactNode
    snapPoints?: Array<string>
    startSnapIndex?: number
    isHandlePanningGesture?: boolean
    renderCloseButton?: () => ReactNode
}

const CustomBottomSheet=
    forwardRef<BottomSheetModal, BottomSheetProps>((
        {
            title = "Bottom Sheet",
            snapPoints = ["100%"],
            startSnapIndex = 0,
            isHandlePanningGesture = true,
            renderCloseButton,
            children
        },
        ref
    ) => {
        const renderBackdrop = useCallback(
            (props: any) =>
                        <BottomSheetBackdrop
                            appearsOnIndex={ 0 }
                            disappearsOnIndex={ -1 }
                            opacity={ 0.6 }
                            { ...props }
                        />
            ,[]
        )

        const styles = getStyles(snapPoints[0] === "100%");

        return (
            <>
                <BottomSheetModal
                    ref={ ref }
                    index={ startSnapIndex }
                    snapPoints={ snapPoints }
                    enablePanDownToClose={ isHandlePanningGesture }
                    enableContentPanningGesture={ isHandlePanningGesture }
                    enableHandlePanningGesture={ isHandlePanningGesture }
                    backdropComponent={ renderBackdrop }
                    backgroundStyle={ styles.containerBackground }
                    handleIndicatorStyle={ isHandlePanningGesture ? styles.line : { height: 0 } }
                >
                    <>
                        <View style={ !renderCloseButton && { paddingTop: SEPARATOR_SIZES.small }}>
                            { renderCloseButton && renderCloseButton() }
                            <Text style={ styles.titleText }>
                                { title }
                            </Text>
                        </View>
                        <BottomSheetView style={{ flex: 1, paddingHorizontal: SEPARATOR_SIZES.medium }}>
                            { children }
                        </BottomSheetView>
                    </>
                </BottomSheetModal>
            </>
        )
    })

const getStyles = (isFullScreen: boolean) =>
    StyleSheet.create({
        containerBackground: {
            backgroundColor: theme.colors.black,
            borderTopLeftRadius: !isFullScreen ? 55 : 0,
            borderTopRightRadius: !isFullScreen ? 55 : 0,
        },
        contentContainer: {
            flex: 1,
            gap: DEFAULT_SEPARATOR,
            paddingHorizontal: DEFAULT_SEPARATOR,
        },
        line: {
            alignSelf: "center",
            marginTop: SEPARATOR_SIZES.normal,
            width: hp(15),
            height: hp(0.75),
            backgroundColor: theme.colors.white2,
            borderRadius: 35
        },
        titleText: {
            ...GLOBAL_STYLE.containerTitleText,
            fontSize: FONT_SIZES.medium,
            textAlign: "center"
        }
    })

export default React.memo(CustomBottomSheet);