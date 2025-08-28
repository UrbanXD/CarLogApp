package com.carlog.carlog_backend.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private UUID id;
    private String email;
    private String avatarUrl;
    private String avatarColor;
    private String firstname;
    private String lastname;
    private Instant createdAt;
}