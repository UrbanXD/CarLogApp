import React from "react";
import Input from "../../../components/Input/Input";
import {GLOBAL_STYLE, ICON_NAMES} from "../../../../Shared/constants/constants";
import {Text} from "react-native";
import Button from "../../../../Button/components/Button";
import TextDivider from "../../../../Shared/components/TextDivider";
import {theme} from "../../../../Shared/constants/theme";
import Form from "../../../components/Form";
import useSignInForm from "./useSignInForm";

interface SignInFormProps {
    forceCloseBottomSheet: () => void
}

const SignInForm: React.FC<SignInFormProps> = ({
    forceCloseBottomSheet
}) => {
    const {
        control,
        submitHandler,
    } = useSignInForm(forceCloseBottomSheet);

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