package com.carlog.carlog_backend.user.controller;

import com.carlog.carlog_backend.user.auth.JwtTokenUtil;
import com.carlog.carlog_backend.user.auth.Session;
import com.carlog.carlog_backend.user.dto.*;
import com.carlog.carlog_backend.user.entity.RefreshToken;
import com.carlog.carlog_backend.user.repository.RefreshTokenRepository;
import com.carlog.carlog_backend.user.service.RefreshTokenService;
import com.carlog.carlog_backend.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.security.interfaces.RSAPublicKey;
import java.util.Base64;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenUtil jwtTokenUtil;
    private final RefreshTokenService refreshTokenService;
    private final RefreshTokenRepository refreshTokenRepository;

    @GetMapping("/sessionUser")
    public ResponseEntity<UserDto> currentUser(@AuthenticationPrincipal Session session) {
        if (session == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        return ResponseEntity.ok(session.getUserDto());
    }

    @PostMapping("/signUp")
    public ResponseEntity<UserDto> signUp(@Valid @RequestBody SignUpRequest request) {
        UserDto userDTO = userService.signUp(request);

        return ResponseEntity.ok(userDTO);
    }

    @PostMapping("/signIn")
    public ResponseEntity<TokensDto> signIn(@Valid @RequestBody SignInRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        Session session = userService.loadUserByUsername(request.getEmail());
        String token = jwtTokenUtil.generateToken(session);

        RefreshToken refreshToken = refreshTokenService.generateRefreshToken(session.getUserDto().getId());

        TokensDto tokens = new TokensDto();
        tokens.setToken(token);
        tokens.setRefreshToken(refreshToken.getToken());

        return ResponseEntity.ok(tokens);
    }

    @PostMapping("/signOut")
    public ResponseEntity<String> signOut(@RequestBody RefreshTokenRequest request) {
        if(request != null && request.getRefreshToken() != null) {
            refreshTokenRepository.findByToken(request.getRefreshToken()).ifPresent(refreshTokenRepository::delete);
        }

        return ResponseEntity.ok("Signed out successfully");
    }

    @PostMapping("/refresh")
    public ResponseEntity<TokensDto> refreshToken(@RequestBody RefreshTokenRequest request) throws BadRequestException {
        try {
            RefreshToken refreshToken = refreshTokenService.verifyRefreshToken(request.getRefreshToken());

            Session session = userService.loadUserByUsername(refreshToken.getUser().getEmail());
            String token = jwtTokenUtil.generateToken(session);

            TokensDto tokens = new TokensDto();
            tokens.setToken(token);
            tokens.setRefreshToken(refreshToken.getToken());

            return ResponseEntity.ok(tokens);
        } catch (Exception e) {
            throw new BadRequestException("Invalid or Expired refresh token");
        }
    }

    @GetMapping("/keys")
    public JwksDto getKeys() {
        RSAPublicKey publicKey = jwtTokenUtil.getPublicKey();

        Map<String, String> keyMap = new HashMap<>();
        keyMap.put("kty", "RSA");
        keyMap.put("kid", "my-secret-carlog-key-id");
        keyMap.put("use", "sig");
        keyMap.put("alg", "RS256");
        keyMap.put("n", Base64.getUrlEncoder().withoutPadding().encodeToString(publicKey.getModulus().toByteArray()));
        keyMap.put("e", Base64.getUrlEncoder().withoutPadding().encodeToString(publicKey.getPublicExponent().toByteArray()));

        return new JwksDto(Collections.singletonList(keyMap));
    }
}