import Button from "../shared/Button"
import { pickImage } from "../../utils/pickImage";
import {
    Image,
    Text
} from "react-native";
import { encode } from "base64-arraybuffer";
import { Control, Controller } from "react-hook-form";

interface InputImagePickerProps {
    control: Control<any>
    fieldName: string
    fieldNameText?: string
}

const InputImagePicker:React.FC<InputImagePickerProps> = ({
    control,
    fieldName,
    fieldNameText
}) => {
    return (
        <Controller
            control={ control }
            name={ fieldName }
            render={
                ({ field: { value, onChange }, fieldState: {error} }) =>
                    <>
                        <Image
                            source={
                                !value
                                    ? require("../../../../assets/images/car2.jpg")
                                    : { uri:`data:image/jpeg;base64,${encode(value.buffer)}` }
                            }
                            style={{ width: 150, height: 200 }}
                        />
                        <Button
                            onPress={ async () => onChange(await pickImage()) }
                            title={ fieldNameText }
                        />
                        {
                            error ? <Text style={{ color: "green" }}>{error.message}</Text> : <></>
                        }
                    </>
            }
        />
    )
}

export default InputImagePicker;