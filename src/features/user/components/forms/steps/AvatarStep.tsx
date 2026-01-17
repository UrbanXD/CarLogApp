import React from "react";
import { useTranslation } from "react-i18next";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import Input from "../../../../../components/Input/Input.ts";
import { AVATAR_COLOR, ICON_NAMES } from "../../../../../constants/index.ts";
import Avatar from "../../../../../components/Avatar/Avatar.ts";
import { UseFormReturn, useWatch } from "react-hook-form";
import { EditUserAvatarRequest } from "../../../schemas/form/editUserAvatarRequest.ts";

type AvatarStepProps = {
    form: UseFormReturn<EditUserAvatarRequest>
    avatarLabel: string
}

export function AvatarStep({
    form: { control },
    avatarLabel
}: AvatarStepProps) {
    const { t } = useTranslation();

    const formIsAvatarImage = useWatch({ control, name: "isImageAvatar" });

    return (
        <Input.Group>
            <Input.Field
                control={ control }
                fieldName="isImageAvatar"
                fieldNameText={ t("auth.user.avatar.type_of_avatar") }
            >
                <Input.Switch
                    label={ {
                        on: t("auth.user.avatar.image"),
                        off: t("auth.user.avatar.monogram")
                    } }
                />
            </Input.Field>
            {
                formIsAvatarImage
                ?
                <Input.Field
                    key="avatar-image-field"
                    control={ control }
                    fieldName="avatar"
                    fieldNameText={ t("auth.user.avatar.title") }
                >
                    <Input.ImagePicker
                        imageStyle={ {
                            aspectRatio: 1,
                            width: hp(20),
                            height: hp(20),
                            borderRadius: 100
                        } }
                        alt={ ICON_NAMES.user }
                    />
                </Input.Field>
                :
                <Input.Field
                    key="avatar-color-field"
                    control={ control }
                    fieldName="avatarColor"
                    fieldNameText={ t("auth.user.avatar.title") }
                >
                    <Input.ColorPicker
                        colors={ AVATAR_COLOR }
                        renderSelectedColor={ (color) => (
                            <Avatar.Text
                                label={ avatarLabel ?? "TT" }
                                backgroundColor={ color ?? undefined }
                                avatarSize={ hp(18) }
                                style={ {
                                    borderWidth: hp(1),
                                    borderColor: "transparent"
                                } }
                            />
                        )
                        }
                    />
                </Input.Field>
            }
        </Input.Group>
    );
};