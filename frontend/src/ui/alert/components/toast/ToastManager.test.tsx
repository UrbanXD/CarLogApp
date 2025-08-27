import { act } from "@testing-library/react-native";
import ToastManager from "./ToastManager.tsx";
import { ALERT_SLIDE_DURATION } from "./AlertToast.tsx";
import { TEST_TOAST } from "./AlertToast.test.tsx";
import { useAlert } from "../../hooks/useAlert.ts";
import { MockInitialReduxState, renderWithRedux } from "../../../../utils/tests/renderWithRedux.tsx";
import { renderHookWithRedux } from "../../../../utils/tests/renderHookWithRedux.tsx";

jest.mock("expo-font", () => ({
    useFonts: () => [true],
    isLoaded: () => true
}));

const renderToastManager = (initialState: MockInitialReduxState) => renderWithRedux(
    <ToastManager children={ <></> }/>,
    initialState
);

describe("ToastManager", () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    it("renders correctly with a single toast message", () => {
        const { queryByTestId, queryAllByTestId } = renderToastManager({
            alert: {
                toasts: [TEST_TOAST],
                modal: null
            }
        });

        expect(queryByTestId("ToastManager")).toBeTruthy();
        expect(queryAllByTestId("ToastContainer")).toBeTruthy();

        act(() => {
            /* slide in animation + toast duration */
            jest.advanceTimersByTime(TEST_TOAST.duration + ALERT_SLIDE_DURATION);
        });

        act(() => {
            jest.advanceTimersByTime(ALERT_SLIDE_DURATION);
        });

        expect(queryByTestId("ToastContainer")).toBeFalsy();
    });

    it("renders correctly with multiple toast messages", () => {
        const { queryByTestId, queryAllByTestId, queryByText, store } = renderToastManager({
            alert: {
                toasts: [TEST_TOAST],
                modal: null
            }
        });

        expect(queryAllByTestId("ToastContainer")).toBeTruthy();
        expect(store.getState().alert.toasts.length).toBe(1);

        act(() => {
            /* (slide in animation + toast duration) / 2 */
            jest.advanceTimersByTime((TEST_TOAST.duration + ALERT_SLIDE_DURATION) / 2);
        });

        const { result } = renderHookWithRedux(useAlert, store);
        act(() => {
            result.current.openToast({ ...TEST_TOAST, id: "Test2", title: "Test Toast2" });
        });

        expect(store.getState().alert.toasts.length).toBe(2);
        expect(queryByText("Test Toast2")).toBeTruthy();

        act(() => {
            jest.advanceTimersByTime(TEST_TOAST.duration + ALERT_SLIDE_DURATION);
        });

        act(() => {
            jest.advanceTimersByTime(ALERT_SLIDE_DURATION);
        });

        expect(queryByTestId("ToastContainer")).toBeFalsy(); // all toasts closed
        expect(store.getState().alert.toasts.length).toBe(0);
    });

    it("removes toast from Redux store (and from Toast Manager) when useAlert's removeToast is called", () => {
        const { queryByTestId, store } = renderToastManager({
            alert: {
                toasts: [TEST_TOAST],
                modal: null
            }
        });

        expect(store.getState().alert.toasts.length).toBe(1);

        const { result } = renderHookWithRedux(useAlert, store);
        act(() => {
            result.current.closeToast(TEST_TOAST.id);
        });

        expect(queryByTestId("ToastContainer")).toBeFalsy();
        expect(store.getState().alert.toasts.length).toBe(0);
    });
});