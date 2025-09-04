package com.carlog.carlog_backend.user.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;


@Component
public class JwtTokenUtil {
    private final PrivateKey privateKey;
    private final PublicKey publicKey;

    @Value("${jwt.expiration}")
    private Long expirationTime;

    public JwtTokenUtil() throws Exception {
        InputStream privStream = getClass().getClassLoader().getResourceAsStream("keys/private_key.pem");
        String privKey = new String(privStream.readAllBytes())
                .replaceAll("-----BEGIN PRIVATE KEY-----", "")
                .replaceAll("-----END PRIVATE KEY-----", "")
                .replaceAll("\\s", "");
        byte[] decodedPriv = Base64.getDecoder().decode(privKey);
        PKCS8EncodedKeySpec keySpecPriv = new PKCS8EncodedKeySpec(decodedPriv);
        privateKey = KeyFactory.getInstance("RSA").generatePrivate(keySpecPriv);

        InputStream pubStream = getClass().getClassLoader().getResourceAsStream("keys/public_key.pem");
        String pubKey = new String(pubStream.readAllBytes())
                .replaceAll("-----BEGIN PUBLIC KEY-----", "")
                .replaceAll("-----END PUBLIC KEY-----", "")
                .replaceAll("\\s", "");
        byte[] decodedPub = Base64.getDecoder().decode(pubKey);
        X509EncodedKeySpec keySpecPub = new X509EncodedKeySpec(decodedPub);
        publicKey = KeyFactory.getInstance("RSA").generatePublic(keySpecPub);
    }

    public boolean isValid(String token) {
        return !getClaims(token).getExpiration().before(new Date());
    }

    public String extractEmail(String token) {
        return getClaims(token).getSubject();
    }

    public String extractToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        return (header != null && header.startsWith("Bearer ")) ? header.substring(7) : null;
    }

    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList()));

        return Jwts
                .builder()
                .claims(claims)
                .header().add("kid", "my-key-id").and()
                .subject(userDetails.getUsername())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(privateKey, Jwts.SIG.RS256)
                .compact();
    }

    private Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(publicKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public RSAPublicKey getPublicKey() {
        return (RSAPublicKey) publicKey;
    }
}
