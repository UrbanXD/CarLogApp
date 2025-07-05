import React from "react";
import Input from "../../../../components/Input/Input.ts";
import { COLORS, GLOBAL_STYLE, ICON_NAMES } from "../../../../constants/index.ts";
import { Text } from "react-native";
import Button from "../../../../components/Button/Button.ts";
import TextDivider from "../../../../components/TextDivider.tsx";
import Form from "../../../../components/Form/Form.tsx";
import { useForm } from "react-hook-form";
import { SignInFormFieldType, useSignInFormProps } from "../../schemas/userSchema.tsx";
import { useUserManagement } from "../../hooks/useUserManagement.ts";

const SignInForm: React.FC = () => {
    const {
        control,
        handleSubmit
    } = useForm<SignInFormFieldType>(useSignInFormProps);
    const { signIn } = useUserManagement();

    const submitHandler =
        handleSubmit(
            async (user: SignInFormFieldType) =>
                await signIn(user)
        );

    return (
        <Form>
            <Input.Field
                control={ control }
                fieldName="email"
                fieldNameText="Email cím"
            >
                <Input.Text
                    icon={ ICON_NAMES.email }
                    placeholder="Email"
                />
            </Input.Field>
            <Input.Field
                control={ control }
                fieldName="password"
                fieldNameText="Jelszó"
            >
                <Input.Text
                    icon={ ICON_NAMES.password }
                    placeholder="Jelszó"
                    secure
                />
            </Input.Field>
            <Text style={ GLOBAL_STYLE.formLinkText }>
                Elfelejtette jelszavát?
            </Text>
            <Button.Text
                text="Bejelentkezés"
                loadingIndicator
                onPress={ submitHandler }
            />
            <TextDivider
                title="vagy"
                color={ COLORS.gray1 }
                lineHeight={ 1 }
                marginVertical={ GLOBAL_STYLE.formContainer.gap }
            />
            <Button.Google/>
        </Form>
    );
};

export default SignInForm;