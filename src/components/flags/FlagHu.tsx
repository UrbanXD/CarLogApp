import * as React from "react";
import { SVGProps } from "react";
import Svg, { G, Path } from "react-native-svg";

export function FlagHu(props: SVGProps<any>) {
    return (
        <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" { ...props }>
            <G fillRule="evenodd">
                <Path fill="#fff" d="M640 480H0V0h640z"/>
                <Path fill="#388d00" d="M640 480H0V320h640z"/>
                <Path fill="#d43516" d="M640 160.1H0V.1h640z"/>
            </G>
        </Svg>
    );
}