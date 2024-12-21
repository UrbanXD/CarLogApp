const isValidHex = (hex: string) => /^#([A-Fa-f0-9]{3,4}){1,2}$/.test(hex);

const getHexArray = (hex: string, chunkSize: number) => hex.slice(1).match(new RegExp(`.{${chunkSize}}`, "g"));

const convertHexUnitTo256 = (hexStr: string) =>
    parseInt(hexStr.repeat(2 / hexStr.length), 16);

const getAlphafloat = (alpha: number, a?: number) => {
    if (typeof a !== "undefined") {
        return a / 255
    }
    if (alpha < 0 || alpha > 1){
        return 1
    }
    return alpha;
}

const hexToRGBA = (hex: string, alpha: number = 1, asArray: boolean = false) => {
    if (!isValidHex(hex)) {
        throw new Error("Invalid HEX");
    }

    const chunkSize = Math.floor((hex.length - 1) / 3);
    const hexArray = getHexArray(hex, chunkSize);
    if(hexArray === null){
        throw new Error("Invalid HEX Array");
    }
    const [r, g, b, a] = hexArray.map(convertHexUnitTo256);

    if(asArray){
        return [ r, g, b, a ];
    }

    return `rgba(${r}, ${g}, ${b}, ${getAlphafloat(alpha, a)})`;
}

export default hexToRGBA;