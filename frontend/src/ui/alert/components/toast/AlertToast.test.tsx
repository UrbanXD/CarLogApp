import { act, fireEvent } from "@testing-library/react-native";
import AlertToast, { ALERT_SLIDE_DURATION } from "./AlertToast.tsx";
import { Toast } from "../../model/types/index.ts";
import { renderWithRedux } from "../../../../utils/tests/renderWithRedux.tsx";

export const TEST_TOAST: Toast = {
    id: "testId",
    type: "info",
    title: "Test Toast",
    body: "body",
    duration: 250
};

const renderToast = (toast: Toast) => renderWithRedux(
    <AlertToast toast={ toast }/>
);

describe("Toast", () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    it("renders the toast correctly", async () => {
        const { queryByText } = renderToast(TEST_TOAST);

        expect(queryByText(TEST_TOAST.title)).toBeTruthy();
        expect(queryByText(TEST_TOAST.body)).toBeTruthy();
    });

    it("animates the toast in on render", () => {
        const { queryByTestId } = renderToast(TEST_TOAST);

        act(() => {
            jest.advanceTimersByTime(ALERT_SLIDE_DURATION);
        });

        expect(queryByTestId("ToastContainer")).toHaveAnimatedStyle({ opacity: 1, transform: [{ translateX: 0 }] });
    });

    it("removes the toast after click", async () => {
        const { queryByTestId } = renderToast(TEST_TOAST);

        act(() => {
            fireEvent.press(queryByTestId("Toast"));
        });

        act(() => {
            jest.advanceTimersByTime(ALERT_SLIDE_DURATION);
        });

        expect(queryByTestId("ToastContainer")).toHaveAnimatedStyle({ opacity: 0 });
    });

    it("removes the toast after the animation completes\"", () => {
        const { queryByTestId } = renderToast(TEST_TOAST);
        act(() => {
            /* slide in animation + toast duration */
            jest.advanceTimersByTime(TEST_TOAST.duration + ALERT_SLIDE_DURATION);
        });

        act(() => {
            jest.advanceTimersByTime(ALERT_SLIDE_DURATION);
        });

        expect(queryByTestId("ToastContainer")).toHaveAnimatedStyle({ opacity: 0 });
    });
});