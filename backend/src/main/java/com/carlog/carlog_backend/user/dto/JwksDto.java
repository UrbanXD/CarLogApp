package com.carlog.carlog_backend.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
public class JwksDto {
    private List<Map<String, String>> keys;

    public List<Map<String, String>> getKeys() {
        return keys;
    }

    public void setKeys(List<Map<String, String>> keys) {
        this.keys = keys;
    }
}
