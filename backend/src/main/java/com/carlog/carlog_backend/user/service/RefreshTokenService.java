package com.carlog.carlog_backend.user.service;

import com.carlog.carlog_backend._exception_handler.exceptions.NotFoundException;
import com.carlog.carlog_backend.user.entity.RefreshToken;
import com.carlog.carlog_backend.user.entity.User;
import com.carlog.carlog_backend.user.repository.RefreshTokenRepository;
import com.carlog.carlog_backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
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

    public RefreshToken verifyRefreshToken(UUID token) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token).orElseThrow(() -> new NotFoundException("Refresh token is invalid"));

        refreshTokenRepository.delete(refreshToken);
        if (isTokenExpired(refreshToken)) throw new RuntimeException("Refresh token is expired");

        return generateRefreshToken(refreshToken.getUser().getId());
    }

    public RefreshToken generateRefreshToken(UUID userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new NotFoundException("User not found"));

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setExpiresAt(Instant.now().plusMillis(refreshTokenExpirationTime));
        refreshToken.setToken(UUID.randomUUID());

        return refreshTokenRepository.save(refreshToken);
    }

    public boolean isTokenExpired(RefreshToken refreshToken) {
        return refreshToken.getExpiresAt().isBefore(Instant.now());
    }

    // cron = sec min hour day_of_month month day_of_week
    @Scheduled(cron = "0 0 0 * * *")
    public void deleteExpiredTokens() {
        refreshTokenRepository.deleteExpiredTokens();
    }
}
