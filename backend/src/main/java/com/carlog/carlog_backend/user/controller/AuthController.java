package com.carlog.carlog_backend.user.controller;

import com.carlog.carlog_backend.user.auth.JwtTokenUtil;
import com.carlog.carlog_backend.user.auth.Session;
import com.carlog.carlog_backend.user.dto.SignInRequest;
import com.carlog.carlog_backend.user.dto.SignUpRequest;
import com.carlog.carlog_backend.user.dto.UserDto;
import com.carlog.carlog_backend.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
    public ResponseEntity<String> login(@Valid @RequestBody SignInRequest request) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
            UserDetails userDetails = userService.loadUserByUsername(request.getEmail());
            String token = jwtTokenUtil.generateToken(userDetails);

            return ResponseEntity.ok(token);
        } catch (Exception e) {
            return new ResponseEntity<>("Invalid email or password", HttpStatus.UNAUTHORIZED);
        }

    }
}