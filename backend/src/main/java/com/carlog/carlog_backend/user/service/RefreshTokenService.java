package com.carlog.carlog_backend.user.service;

import com.carlog.carlog_backend._exception_handler.exceptions.NotFoundException;
import com.carlog.carlog_backend.user.entity.RefreshToken;
import com.carlog.carlog_backend.user.entity.User;
import com.carlog.carlog_backend.user.repository.RefreshTokenRepository;
import com.carlog.carlog_backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {
    @Value("${jwt.refreshExpiration}")
    private Long refreshTokenExpirationTime;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;

    public RefreshToken verifyRefreshToken(String token) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token).orElseThrow(() -> new NotFoundException("Refresh token is invalid"));

        if(!isTokenExpired(refreshToken)) return refreshToken;

        refreshTokenRepository.delete(refreshToken);
        throw new RuntimeException("Refresh token is expired");
    }

    public RefreshToken generateRefreshToken(UUID userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new NotFoundException("User not found"));

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setExpiresAt(Instant.now().plusMillis(refreshTokenExpirationTime));
        refreshToken.setToken(UUID.randomUUID().toString());

        return refreshTokenRepository.save(refreshToken);
    }

    public boolean isTokenExpired(RefreshToken refreshToken) {
        return refreshToken.getExpiresAt().isBefore(Instant.now());
    }
}
