import React, { useState } from "react";
import { View } from "react-native";
import { SIMPLE_HEADER_HEIGHT } from "../../../constants";
import Avatar from "../../Avatar/Avatar.ts";
import { router } from "expo-router";
import { getLabelByName } from "../../../utils/getLabelByName.ts";
import HeaderView from "./HeaderView.tsx";
import { CarPicker } from "../../../features/car/components/carPicker/CarPicker.tsx";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useUser } from "../../../features/user/hooks/useUser.ts";

const PrimaryHeader: React.FC = () => {
    const { user, isLoading } = useUser();
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
                            isLoading || !user
                            ? <Avatar.Skeleton
                                avatarSize={ SIMPLE_HEADER_HEIGHT * 0.85 }
                            />
                            : user.avatarPath
                              ? <Avatar.Image
                                  path={ user.avatarPath }
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