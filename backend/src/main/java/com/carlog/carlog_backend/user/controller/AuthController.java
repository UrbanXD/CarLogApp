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

        UserDetails userDetails = userService.loadUserByUsername(request.getEmail());
        String token = jwtTokenUtil.generateToken(userDetails);

        UserDto user = userService.getUserByEmail(userDetails.getUsername());
        RefreshToken refreshToken = refreshTokenService.generateRefreshToken(user.getId());

        TokensDto tokens = new TokensDto();
        tokens.setToken(token);
        tokens.setRefreshToken(refreshToken.getToken());

        return ResponseEntity.ok(tokens);
    }

    @PostMapping("/signOut")
    public ResponseEntity<String> signOut(@RequestBody RefreshTokenRequest request) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(request.getRefreshToken()).orElseGet(null);

        if (refreshToken != null) refreshTokenRepository.delete(refreshToken);
        return ResponseEntity.ok("Signed out successfully");
    }

    @PostMapping("/refresh")
    public ResponseEntity<TokensDto> refreshToken(@RequestBody RefreshTokenRequest request) throws BadRequestException {
        try {
            RefreshToken refreshToken = refreshTokenService.verifyRefreshToken(request.getRefreshToken());

            UserDetails userDetails = userService.loadUserByUsername(refreshToken.getUser().getEmail());
            String token = jwtTokenUtil.generateToken(userDetails);

            TokensDto tokens = new TokensDto();
            tokens.setToken(token);
            tokens.setRefreshToken(refreshToken.getToken());

            return ResponseEntity.ok(tokens);
        } catch (Exception e) {
            throw new BadRequestException("Invalid or Expired refresh token");
        }
    }
}