import React from "react";
import Input from "../../../components/Input/Input";
import { GLOBAL_STYLE, ICON_NAMES } from "../../../../../constants/constants";
import {Text, View} from "react-native";
import Button from "../../../../../components/Button/Button";
import TextDivider from "../../../../../components/TextDivider";
import { theme } from "../../../../../constants/theme";
import Form from "../../../components/Form";
import useSignInForm from "./useSignInForm";

interface SignInFormProps {
    dismissBottomSheet?: () => void
}

const SignInForm: React.FC<SignInFormProps> = ({
    dismissBottomSheet = () => {},
}) => {
    const {
        control,
        submitHandler,
    } = useSignInForm(dismissBottomSheet);

    return (
        <Form>
            <Input.Text
                control={ control }
                fieldName="email"
                fieldNameText="Email cím"
                icon={ ICON_NAMES.email }
                placeholder="Email"
            />
            <Input.Text
                control={ control }
                fieldName="password"
                fieldNameText="Jelszó"
                icon={ ICON_NAMES.password }
                placeholder="Jelszó"
                isSecure
            />
            <Text style={ GLOBAL_STYLE.formLinkText }>
                Elfelejtette jelszavát?
            </Text>
            <Button.Text
                text="Bejelentkezés"
                onPress={ submitHandler }
            />
            <TextDivider
                title="vagy"
                color={ theme.colors.gray1 }
                lineHeight={ 1 }
                marginVertical={ GLOBAL_STYLE.formContainer.gap }

            />
            <Button.Google onPress={ () => 1 } />
        </Form>
    )
}

export default SignInForm;