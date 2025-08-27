import { Store } from "redux";
import { ReactNode } from "react";
import { Provider } from "react-redux";
import { renderHook } from "@testing-library/react-native";

export const renderHookWithRedux = <P, R>(hook: (props: P) => R, store: Store) => {
    const wrapper = ({ children }: { children: ReactNode }) => (
        <Provider store={ store }>{ children }</Provider>
    );

    return renderHook(hook, { wrapper });
};