package com.carlog.carlog_backend.car.details.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ModelDto {
    private Long id;
    private MakeDto make;
    private String name;
    private String startYear;
    private String endYear;
    @JsonIgnore
    private Boolean active;
}
