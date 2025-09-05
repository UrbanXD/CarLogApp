package com.carlog.carlog_backend.user.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.*;
import java.util.stream.Collectors;


@Component
public class JwtTokenUtil {
    private final PrivateKey privateKey;
    private final PublicKey publicKey;

    @Value("${jwt.expiration}")
    private Long expirationTime;

    @Value("${jwt.keyId}")
    private String keyId;

    @Value("${jwt.aud.carlog}")
    private String audCarlog;

    @Value("${jwt.aud.powersync}")
    private String audPowersync;

    public JwtTokenUtil() throws IOException, NoSuchAlgorithmException, InvalidKeySpecException {
        PKCS8EncodedKeySpec keySpecPrivate = new PKCS8EncodedKeySpec(loadDecodedKey("keys/private_key.pem"));
        privateKey = KeyFactory.getInstance("RSA").generatePrivate(keySpecPrivate);

        X509EncodedKeySpec keySpecPub = new X509EncodedKeySpec(loadDecodedKey("keys/public_key.pem"));
        publicKey = KeyFactory.getInstance("RSA").generatePublic(keySpecPub);
    }

    public RSAPublicKey getPublicKey() {
        return (RSAPublicKey) publicKey;
    }

    public boolean isValid(String token) {
        return !getClaims(token).getExpiration().before(new Date());
    }

    public UUID extractUserId(String token) {
        return UUID.fromString(getClaims(token).getSubject());
    }

    public String extractToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        return (header != null && header.startsWith("Bearer ")) ? header.substring(7) : null;
    }

    public String generateToken(Session session) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", session.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList()));

        return Jwts
                .builder()
                .claims(claims)
                .header().add("kid", keyId).and()
                .audience().add(audCarlog).and()
                .audience().add(audPowersync).and()
                .subject(String.valueOf(session.getUserDto().getId()))
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(privateKey, Jwts.SIG.RS256)
                .compact();
    }

    private Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(publicKey)
                .requireAudience(audCarlog)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private byte[] loadDecodedKey(String path) throws IOException {
        InputStream inputStream = getClass().getClassLoader().getResourceAsStream(path);
        assert inputStream != null;

        String key = new String(inputStream.readAllBytes())
                .replaceAll("-----BEGIN ([A-Z ]*)-----", "")
                .replaceAll("-----END ([A-Z ]*)-----", "")
                .replaceAll("\\s", "");

        return Base64.getDecoder().decode(key);
    }
}
