jest.mock("react-native-safe-area-context", () => ({
    useSafeAreaInsets: () => ({ top: 10, bottom: 10 })
}));

jest.mock("@testing-library/jest-native/extend-expect", () => null, {
    virtual: true
});