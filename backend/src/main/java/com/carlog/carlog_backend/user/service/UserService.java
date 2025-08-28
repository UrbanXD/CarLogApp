package com.carlog.carlog_backend.user.service;

import com.carlog.carlog_backend.user.auth.Session;
import com.carlog.carlog_backend.user.dto.SignUpRequest;
import com.carlog.carlog_backend.user.dto.UserDto;
import com.carlog.carlog_backend.user.entity.User;
import com.carlog.carlog_backend.user.mapper.UserMapper;
import com.carlog.carlog_backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        return new Session(
                user.getEmail(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("user")),
                userMapper.toUserDto(user)
        );
    }

    @Transactional(readOnly = true)
    public List<UserDto> getAllUsers() {
        return userMapper.toUserDtoList(userRepository.findAll());
    }

    public UserDto signUp(SignUpRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already taken");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstname(request.getFirstName());
        user.setLastname(request.getLastName());
        user.setAvatarColor(request.getAvatarColor());
        user.setCreatedAt(Instant.now());

        try {
            User savedUser = userRepository.save(user);
            return userMapper.toUserDto(savedUser);
        } catch (Exception e) {
            throw new RuntimeException("Sign up error: " + e.getMessage(), e);
        }
    }

    public UserDto getUserByID(UUID id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isEmpty()) throw new IllegalArgumentException("User not found.");

        return userMapper.toUserDto(user.get());
    }
}
