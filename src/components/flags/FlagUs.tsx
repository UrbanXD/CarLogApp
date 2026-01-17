import * as React from "react";
import Svg, { Defs, G, Marker, Path, SvgProps } from "react-native-svg";

export function FlagUs(props: SvgProps) {
    return (
        <Svg
            viewBox="0 0 640 480"
            id="flag-icons-us"
            { ...props }
        >
            <Defs>
                <Marker
                    id="us-a"
                    markerHeight="30"
                    markerWidth="30"
                    refX="30"
                    refY="30"
                >
                    <G transform="scale(1)">
                        <Path fill="#fff" d="m14 0 9 27L0 10h28L5 27z"/>
                    </G>
                </Marker>
            </Defs>
            <Path fill="#bd3d44" d="M0 0h640v480H0"/>
            <Path
                stroke="#fff"
                strokeWidth="37"
                d="M0 55.3h640M0 129h640M0 203h640M0 277h640M0 351h640M0 425h640"
            />
            <Path fill="#192f5d" d="M0 0h364.8v258.5H0"/>
            <Path
                fill="none"
                markerMid="url(#us-a)"
                d="m0 0 16 11h61 61 61 61 60L47 37h61 61 60 61L16 63h61 61 61 61 60L47 89h61 61 60 61L16 115h61 61 61 61 60L47 141h61 61 60 61L16 166h61 61 61 61 60L47 192h61 61 60 61L16 218h61 61 61 61 60z"
            />
        </Svg>
    );
}