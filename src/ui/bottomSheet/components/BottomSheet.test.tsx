import React from "react";
import { Text } from "react-native";
import { act, fireEvent } from "@testing-library/react-native";
import BottomSheet, { BottomSheetProps } from "./BottomSheet.tsx";
import { router } from "expo-router";
import { renderRouterWithRedux } from "../../../utils/tests/renderWithRedux.tsx";
import { screen } from "expo-router/testing-library";
import * as alertSlice from "../../alert/model/slice/index.ts";
import ModalManager from "../../alert/components/modal/ModalManager.tsx";

jest.mock("@react-native-google-signin/google-signin", () => {
    return {
        GoogleSignin: jest.fn()
    };
});

const mockPresentBottomSheet = jest.fn();
const mockDismissBottomSheet = jest.fn();
const mockCloseBottomSheet = jest.fn();
const mockExpandBottomSheet = jest.fn();
let bottomSheetModalProps: any = null;

jest.mock("@gorhom/bottom-sheet", () => {
    const React = require("react");
    const { View } = require("react-native");

    const BottomSheetModal = React.forwardRef((props, ref) => {
        bottomSheetModalProps = props;
        React.useImperativeHandle(ref, () => ({
            present: mockPresentBottomSheet,
            dismiss: mockDismissBottomSheet,
            close: mockCloseBottomSheet,
            expand: mockExpandBottomSheet
        }));
        return <View testID="BottomSheetModal">{ props.children }</View>;
    });

    const BottomSheetView = ({ children }) => <View testID="BottomSheetView">{ children }</View>;

    return {
        BottomSheetModal,
        BottomSheetView
    };
});

const renderBottomSheet = (props?: BottomSheetProps) => (
    <ModalManager>
        <BottomSheet
            title="Test Sheet Title"
            content={ <Text>Content</Text> }
            snapPoints={ ["50%"] }
            { ...props }
        />
    </ModalManager>
);

describe("BottomSheet", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.clearAllTimers();
    });

    it("automatically presents the bottom sheet with title and content", async () => {
        const { queryByTestId, queryByText } = renderRouterWithRedux(
            {
                "default": () => <></>,
                "bottomSheet/test": renderBottomSheet
            },
            "default"
        );

        act(() => {
            router.push("/bottomSheet/test"); //open bottomSheet
        });

        /* check after route to bottom sheet screen its automatically presents sheet correctly */
        expect(mockPresentBottomSheet).toHaveBeenCalled();
        expect(queryByText("Test Sheet Title")).toBeTruthy();
        expect(queryByText("Content")).toBeTruthy();
        expect(queryByTestId("BottomSheetModal")).toBeTruthy();
        expect(queryByTestId("BottomSheetView")).toBeTruthy();
    });

    it("dismisses the bottom sheet and navigates back when enableDismissOnClose is true", async () => {
        const { queryByText } = renderRouterWithRedux(
            {
                "default": () => <></>,
                "bottomSheet/test": () => renderBottomSheet({ enableDismissOnClose: true })
            },
            "default"
        );

        act(() => {
            router.push("/bottomSheet/test"); //open bottomSheet
        });

        act(() => {
            bottomSheetModalProps?.onChange?.(-1); //close bottomSheet
        });

        expect(mockDismissBottomSheet).toHaveBeenCalled();
        expect(screen).toHavePathname("/default"); // get back to default screen (bottom sheet closed)
        expect(queryByText("Test Sheet Title")).toBeFalsy(); //sheet content dismissed correctly
    });

    it("does not dismiss the bottom sheet or navigate away when enableDismissOnClose is false", async () => {
        const { queryByText } = renderRouterWithRedux(
            {
                "default": () => <></>,
                "bottomSheet/test": () => renderBottomSheet({ enableDismissOnClose: false })
            },
            "default"
        );

        const openModalSpy = jest.spyOn(alertSlice, "openModal");

        act(() => {
            router.push("/bottomSheet/test"); //open bottomSheet
        });

        act(() => {
            bottomSheetModalProps?.onChange?.(-1); //close bottomSheet
        });

        expect(queryByText("Test Sheet Title")).toBeTruthy(); // sheet closed but content is still alive
        expect(screen).toHavePathname("/bottomSheet/test"); // stayed at bottom sheet route
        expect(openModalSpy).toHaveBeenCalled();
    });

    it("reopens the bottom sheet when the leaving modal is declined via button", () => {
        const { queryByText } = renderRouterWithRedux(
            {
                "default": () => <></>,
                "bottomSheet/test": () => renderBottomSheet({ enableDismissOnClose: false })
            },
            "default"
        );

        const openModalSpy = jest.spyOn(alertSlice, "openModal");

        act(() => {
            router.push("/bottomSheet/test"); //open bottomSheet
        });

        act(() => {
            bottomSheetModalProps?.onChange?.(-1); //close bottomSheet
        });

        expect(openModalSpy).toHaveBeenCalled();

        act(() => {
            fireEvent.press(queryByText("Mégse"));
        });

        expect(mockExpandBottomSheet).toHaveBeenCalled();
        expect(queryByText("Test Sheet Title")).toBeTruthy();
    });

    it("dismisses and removes the bottom sheet when the leaving modal is accepted via button", () => {
        const { queryByText } = renderRouterWithRedux(
            {
                "default": () => <></>,
                "bottomSheet/test": () => renderBottomSheet({ enableDismissOnClose: false })
            },
            "default"
        );

        const openModalSpy = jest.spyOn(alertSlice, "openModal");

        act(() => {
            router.push("/bottomSheet/test"); //open bottomSheet
        });

        act(() => {
            bottomSheetModalProps?.onChange?.(-1); //close bottomSheet
        });

        expect(openModalSpy).toHaveBeenCalled();

        act(() => {
            fireEvent.press(queryByText("Űrlap bezárása"));
        });

        expect(mockDismissBottomSheet).toHaveBeenCalled();
        expect(screen).toHavePathname("/default"); // get back to default screen (bottom sheet closed)
        expect(queryByText("Test Sheet Title")).toBeFalsy(); //sheet content dismissed correctly
    });
});