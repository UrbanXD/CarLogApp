import { TEST_MODAL } from "./AlertModal.test.tsx";
import ModalManager from "./ModalManager.tsx";
import { MockInitialReduxState, renderWithRedux } from "../../../../utils/tests/renderWithRedux.tsx";
import { act } from "@testing-library/react-native";
import { useAlert } from "../../hooks/useAlert.ts";
import { renderHookWithRedux } from "../../../../utils/tests/renderHookWithRedux.tsx";

const renderModalManager = (initialState: MockInitialReduxState) => renderWithRedux(
    <ModalManager children={ <></> }/>,
    initialState
);

describe("ModalManager", () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    it("renders the modal correctly via ModalManager", () => {
        const { queryByTestId } = renderModalManager({
            alert: {
                toasts: [],
                modal: TEST_MODAL
            }
        });

        expect(queryByTestId("ModalManager")).toBeTruthy();
        expect(queryByTestId("ModalContainer")).toBeTruthy();
    });

    it("renders modal when useAlert sets it, and closes it on dismiss", () => {
        const { queryByTestId, store } = renderModalManager({
            alert: {
                toasts: [],
                modal: null
            }
        });

        expect(queryByTestId("ModalContainer")).toBeFalsy();

        const { result } = renderHookWithRedux(useAlert, store);

        act(() => {
            result.current.openModal(TEST_MODAL);
        });

        expect(store.getState().alert.modal).not.toBeNull();
        expect(queryByTestId("ModalContainer")).toBeTruthy(); // checks if openModal function works correctly

        act(() => {
            result.current.dismissModal();
        });

        expect(store.getState().alert.modal).toBeNull();
        expect(queryByTestId("ModalContainer")).toBeFalsy(); // checks if dismissModal function works correctly
    });
});