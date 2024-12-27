import React, { forwardRef, ReactNode, useCallback } from "react";
import { StyleSheet, View, Text } from "react-native";
import { theme } from "../../constants/theme";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { DEFAULT_SEPARATOR, FONT_SIZES, GLOBAL_STYLE, SEPARATOR_SIZES } from "../../constants/constants";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {useBottomSheet} from "../../context/BottomSheetProvider";
import pickerDisabledToast from "../../../alert/layouts/toast/pickerDisabledToast";
import Alert from "../../../alert/components/Alert";
import {useAlert} from "../../../alert/context/AlertProvider";
import {bottomSheetLeavingModal} from "../../../alert/layouts/modal/bottomSheetLeavingModal";

interface BottomSheetProps {
    title?: string
    children?: ReactNode
    snapPoints?: Array<string>
    startSnapIndex?: number
    isHandlePanningGesture?: boolean
    enableDismiss?: boolean
    renderCloseButton?: () => ReactNode
    reopen: () => void,
    forceClose: () => void
}

const CustomBottomSheet=
    forwardRef<BottomSheetModal, BottomSheetProps>((
        {
            title = "Bottom Sheet",
            snapPoints = ["100%"],
            startSnapIndex = 0,
            isHandlePanningGesture = true,
            renderCloseButton,
            reopen,
            forceClose,
            enableDismiss = true,
            children
        },
        ref
    ) => {
        const renderBackdrop =
            useCallback(
            (props: any) =>{
                return (<BottomSheetBackdrop
                            appearsOnIndex={ 1 }
                            disappearsOnIndex={ -1 }
                            opacity={ 0.6 }
                            onPress={
                                () => console.log("mognyomva")
                            }
                            { ...props }
                        />)}
            ,[]
            );
        const isFullScreen = snapPoints[0] === "100%";
        const styles = useStyles(isFullScreen);
        const { top } = useSafeAreaInsets();
        const { openModal } = useAlert();

        return (
            <>
                <BottomSheetModal
                    ref={ ref }
                    index={ startSnapIndex }
                    snapPoints={ snapPoints }
                    onChange={
                        (index)=> {
                            if(index === -1) openModal(bottomSheetLeavingModal(reopen, forceClose));
                        }
                    }
                    enableDismissOnClose={ enableDismiss }
                    enablePanDownToClose={ isHandlePanningGesture }
                    enableContentPanningGesture={ isHandlePanningGesture }
                    enableHandlePanningGesture={ isHandlePanningGesture }
                    enableOverDrag={ false }
                    backdropComponent={ renderBackdrop }
                    backgroundStyle={ styles.containerBackground }
                    handleIndicatorStyle={ isHandlePanningGesture ? styles.line : { height: 0 } }
                >
                    <>
                        <View style={{ paddingTop: top / 2 }}>
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

const useStyles = (isFullScreen: boolean) =>
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