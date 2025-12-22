import React, { useState } from "react";
import { View } from "react-native";
import { SIMPLE_HEADER_HEIGHT } from "../../../constants/index.ts";
import Avatar from "../../Avatar/Avatar.ts";
import { router } from "expo-router";
import { getLabelByName } from "../../../utils/getLabelByName.ts";
import { useAppSelector } from "../../../hooks/index.ts";
import HeaderView from "./HeaderView.tsx";
import { getUser, isUserLoading } from "../../../features/user/model/selectors/index.ts";
import { CarPicker } from "../../../features/car/components/carPicker/CarPicker.tsx";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

const PrimaryHeader: React.FC = () => {
    const user = useAppSelector(getUser);
    const userLoading = useAppSelector(isUserLoading);
    const name = `${ user?.lastname } ${ user?.firstname }`;

    const [isCarListVisible, setIsCarListVisible] = useState(false);

    const openProfile = () => {
        router.push("/(profile)/user");
    };

    return (
        <HeaderView>
            <View style={ { flex: 1 } }>
                <CarPicker onCarListVisibleChange={ setIsCarListVisible }/>
            </View>
            {
                !isCarListVisible && (
                    <Animated.View entering={ FadeIn } exiting={ FadeOut }>
                        {
                            userLoading || !user
                            ? <Avatar.Skeleton
                                avatarSize={ SIMPLE_HEADER_HEIGHT * 0.85 }
                            />
                            : user.avatar
                              ? <Avatar.Image
                                  source={ user.avatar.base64 }
                                  avatarSize={ SIMPLE_HEADER_HEIGHT * 0.85 }
                                  onPress={ openProfile }
                              />
                              : <Avatar.Text
                                  label={ getLabelByName(name) }
                                  avatarSize={ SIMPLE_HEADER_HEIGHT * 0.85 }
                                  backgroundColor={ user.avatarColor }
                                  onPress={ openProfile }
                              />
                        }
                    </Animated.View>
                )
            }
        </HeaderView>
    );
};

export default PrimaryHeader;