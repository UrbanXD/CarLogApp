import { FieldValues, SubmitErrorHandler, SubmitHandler } from "react-hook-form";
import {
    Falsy,
    RecursiveArray,
    RegisteredStyle,
    TextStyle as RNTextStyle,
    ViewStyle as RNViewStyle
} from "react-native";

export * from "./Color";
export * from "./ImageSource";
export * from "./RenderComponent.ts";
export * from "./Step.ts";

export type ViewStyle =
    (number & { __registeredStyleBrand: RNViewStyle }) |
    RecursiveArray<RegisteredStyle<RNViewStyle> | Falsy | RNViewStyle>
    | false | null | undefined | RNViewStyle;

export type TextStyle =
    (number & { __registeredStyleBrand: RNTextStyle })
    | RecursiveArray<RegisteredStyle<RNTextStyle> | Falsy | RNTextStyle>
    | false | null | undefined |
    RNTextStyle;

export type SubmitHandlerArgs<FormResult extends FieldValues> = {
    onValid: SubmitHandler<FormResult>,
    onInvalid?: SubmitErrorHandler<FormResult>
}

export type WithPrefix<T, P extends string> = {
    [K in keyof T as `${ P }_${ string & K }`]: T[K];
};

export type Nullable<T> = { [K in keyof T]: T[K] | null };