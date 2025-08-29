package com.carlog.carlog_backend.car.details.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MakeDto {
    private Long id;
    private String name;
    @JsonIgnore
    private Boolean active;
}
