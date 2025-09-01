package com.carlog.carlog_backend.user.mapper;

import com.carlog.carlog_backend._configuration.MapstructConfig;
import com.carlog.carlog_backend.user.dto.UserDto;
import com.carlog.carlog_backend.user.entity.User;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(config = MapstructConfig.class)
public interface UserMapper {
    UserDto toUserDto(User user);

    List<UserDto> toUserDtoList(List<User> users);
}