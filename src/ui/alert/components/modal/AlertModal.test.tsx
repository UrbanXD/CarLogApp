import { Modal } from "../../model/types/index.ts";
import { act, fireEvent } from "@testing-library/react-native";
import AlertModal from "./AlertModal.tsx";
import { MockInitialReduxState, renderWithRedux } from "../../../../utils/tests/renderWithRedux.tsx";

jest.mock("@react-native-google-signin/google-signin", () => {
    return {
        GoogleSignin: jest.fn()
    };
});

const mockAcceptModal = jest.fn();
const mockDismissModal = jest.fn();

export const TEST_MODAL: Modal = {
    title: "Test Modal",
    body: "Test Modal Body",
    acceptText: "Accept Modal",
    acceptAction: jest.fn(() => mockAcceptModal()),
    dismissText: "Dismiss Modal",
    dismissAction: jest.fn(() => mockDismissModal())
};

const renderModal = (modal: Modal, initialState: MockInitialReduxState) => {
    return renderWithRedux(
        <AlertModal { ...modal } accept={ modal.acceptAction } dismiss={ modal.dismissAction }/>,
        initialState
    );
};

describe("Modal", () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    it("renders modal correctly", () => {
        const { queryByTestId, queryByText } = renderModal(TEST_MODAL);

        expect(queryByTestId("Modal")).toBeTruthy();
        expect(queryByText(TEST_MODAL.title)).toBeTruthy();
        expect(queryByText(TEST_MODAL.body)).toBeTruthy();
        expect(queryByText(TEST_MODAL.acceptText)).toBeTruthy();
        expect(queryByText(TEST_MODAL.dismissText)).toBeTruthy();
    });

    it("dismisses modal when dismiss button is pressed", async () => {
        const { queryByTestId, queryByText } = renderWithRedux(
            <AlertModal { ...TEST_MODAL } accept={ TEST_MODAL.acceptAction } dismiss={ TEST_MODAL.dismissAction }/>
        );

        expect(queryByTestId("Modal")).toBeTruthy();

        await act(async () => {
            fireEvent.press(queryByText(TEST_MODAL.dismissText));
        });

        expect(mockDismissModal).toHaveBeenCalled();
    });

    it("calls accept modal function after accept button is pressed", async () => {
        const { queryByTestId, queryByText } = renderWithRedux(
            <AlertModal { ...TEST_MODAL } accept={ TEST_MODAL.acceptAction } dismiss={ TEST_MODAL.dismissAction }/>
        );

        expect(queryByTestId("Modal")).toBeTruthy();

        await act(async () => {
            fireEvent.press(queryByText(TEST_MODAL.acceptText));
        });

        expect(mockAcceptModal).toHaveBeenCalled();
    });
});