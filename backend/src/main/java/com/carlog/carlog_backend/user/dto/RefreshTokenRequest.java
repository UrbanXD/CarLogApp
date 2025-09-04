package com.carlog.carlog_backend.user.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class RefreshTokenRequest {
    private UUID refreshToken;
}
