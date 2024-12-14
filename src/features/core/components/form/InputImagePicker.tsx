import {useEffect, useState } from "react";
import Button from "../shared/Button"
import { pickImage } from "../../utils/pickImage";
import {
    Image
} from "react-native";
import { encode } from "base64-arraybuffer";

const InputImagePicker:React.FC = () => {
    const [imageBuffer, setImageBuffer] = useState<ArrayBuffer | null>(null);

    useEffect(() => {
        console.log("Image buffer changed: ", imageBuffer?.byteLength);
    }, [imageBuffer]);

    return (
        <>
            <Image
                source={
                    !imageBuffer
                        ? require("../../../../assets/images/car2.jpg")
                        : { uri:`data:image/jpeg;base64,${encode(imageBuffer)}` }
                }
                style={{ width: 200, height: 200 }}
            />
            <Button
                onPress={ async () => setImageBuffer(await pickImage()) }
                title={"pick image"}
            />
        </>
    )
}

// <Controller
//     control={ control }
//     name={ fieldName }
//     render={ ({ field: { onChange }, fieldState: { error } }) =>
//         isDataAdjusted
//             ?   <Picker
//                 data={ adjustedData }
//                 error = { error?.message }
//                 searchTerm={ searchTerm }
//                 setSearchTerm={ withSearchbar ? ((value) => setSearchTerm(value)) : undefined }
//                 selectedItemID={ selectedItemID }
//                 onSelect={
//                     (id: string) => {
//                         setSelectedItemID(id);
//                         console.log("OnSelected", id)
//                         onChange(adjustedData.find(item => item.id === id)?.value?.toString());
//                     }
//                 }

export default InputImagePicker;