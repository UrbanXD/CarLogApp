import React, { forwardRef, ReactNode, useCallback } from "react";
import { StyleSheet, View, Text } from "react-native";
import { theme } from "../../core/constants/theme";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { DEFAULT_SEPARATOR, FONT_SIZES, GLOBAL_STYLE, SEPARATOR_SIZES } from "../../core/constants/constants";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useAlert } from "../../alert/context/AlertProvider";
import { bottomSheetLeavingModal } from "../../alert/layouts/modal/bottomSheetLeavingModal";
import BottomSheetBackdrop from "./BottomSheetBackdrop";
import BottomSheetContainer from "./BottomSheetContainer";
import {BottomSheetModalProps} from "@gorhom/bottom-sheet/src/components/bottomSheetModal/types";

interface BottomSheetProps extends Partial<BottomSheetModalProps> {
    title?: string
    renderContent: () => ReactNode
    renderCloseButton?: () => ReactNode
    reopen: () => void,
    forceClose: () => void
}

const BottomSheet=
    forwardRef<BottomSheetModal, BottomSheetProps>((props, ref) => {
        const {
            title= "Bottom Sheet",
            renderContent,
            renderCloseButton,
            reopen,
            forceClose,
            ...restProps
        } = props;

        const { snapPoints, enableHandlePanningGesture } = restProps;

        const snaps = snapPoints as Array<string | number> || [];
        const styles = useStyles(snaps[0] === "100%", !!enableHandlePanningGesture);

        return (
            <>
                <BottomSheetModal
                    ref={ ref }
                    { ...restProps }
                    backdropComponent={ (props: any) => <BottomSheetBackdrop { ...props } /> }
                    backgroundStyle={ styles.containerBackground }
                    handleIndicatorStyle={ styles.line }
                >
                    <BottomSheetContainer
                        title={ title }
                        renderCloseButton={ renderCloseButton }
                    >
                        { renderContent() }
                    </BottomSheetContainer>
                </BottomSheetModal>
            </>
        )
    })

const useStyles = (isFullScreen: boolean, isHandlePanningGesture: boolean) =>
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
            height: isHandlePanningGesture ? hp(0.75) : 0,
            backgroundColor: theme.colors.white2,
            borderRadius: 35
        },
    })

export default React.memo(BottomSheet);