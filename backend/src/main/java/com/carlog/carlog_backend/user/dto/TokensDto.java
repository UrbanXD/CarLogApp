package com.carlog.carlog_backend.user.dto;

import lombok.Data;

@Data
public class TokensDto {
    private String token;
    private String refreshToken;
}
