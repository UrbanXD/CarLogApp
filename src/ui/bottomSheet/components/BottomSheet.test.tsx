import React from "react";
import { Text } from "react-native";
import { renderRouter, screen } from "expo-router/testing-library";
import { act } from "@testing-library/react-native";
import BottomSheet, { BottomSheetProps } from "./BottomSheet.tsx";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { router } from "expo-router";

const mockStore = configureStore([]);
let defaultStore = mockStore({});

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

const renderTestBottomSheet = (props?: BottomSheetProps, store = defaultStore) => (
    <Provider store={ store }>
        <BottomSheet
            title="Test Sheet Title"
            content={ <Text>Content</Text> }
            snapPoints={ ["50%"] }
            { ...props }
        />
    </Provider>
);

describe("BottomSheet", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.clearAllTimers();
        defaultStore = mockStore([]);
    });

    it("renders title, content, and presents automatically", async () => {
        const MockBottomSheetComponent = jest.fn(() => renderTestBottomSheet());

        const { queryByTestId, queryByText } = renderRouter(
            {
                "default": jest.fn(() => <></>),
                "bottomSheet/test": MockBottomSheetComponent
            },
            { initialUrl: "default" }
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

    it("when enableDismissOnClose is true, closing a bottom sheet dismiss the sheet and router screen", async () => {
        const MockBottomSheetComponent = jest.fn(() =>
            renderTestBottomSheet({
                enableDismissOnClose: true
            })
        );

        const { queryByText } = renderRouter(
            {
                "default": jest.fn(() => <></>),
                "bottomSheet/test1": MockBottomSheetComponent
            },
            {
                initialUrl: "/default"
            }
        );

        act(() => {
            router.push("/bottomSheet/test1"); //open bottomSheet
        });

        act(() => {
            bottomSheetModalProps?.onChange?.(-1); //close bottomSheet
        });

        expect(mockDismissBottomSheet).toHaveBeenCalled();
        expect(screen).toHavePathname("/default"); //visszakerult-e az alap oldalra
        expect(queryByText("Test Sheet Title")).toBeFalsy(); //valoban eltunt-e a sheet
    });

    it(
        "when enableDismissOnClose is false, closing a bottom sheet not dismisses it and stay at the current route",
        async () => {
            const MockBottomSheetComponent = jest.fn(() =>
                renderTestBottomSheet({
                    enableDismissOnClose: false
                })
            );

            const { queryByText } = renderRouter(
                {
                    "default": jest.fn(() => <></>),
                    "bottomSheet/test1": MockBottomSheetComponent
                },
                {
                    initialUrl: "/default"
                }
            );

            act(() => {
                router.push("/bottomSheet/test1"); //open bottomSheet
            });

            act(() => {
                bottomSheetModalProps?.onChange?.(-1); //close bottomSheet
            });

            expect(queryByText("Test Sheet Title")).toBeTruthy(); // sheet closed but content is still alive
            expect(screen).toHavePathname("/bottomSheet/test1"); // stayed at bottom sheet route
            // expect(openModal).toHaveBeenCalled();
        }
    );
});