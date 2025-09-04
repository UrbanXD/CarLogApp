package com.carlog.carlog_backend.user.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class TokensDto {
    private String token;
    private UUID refreshToken;
}
