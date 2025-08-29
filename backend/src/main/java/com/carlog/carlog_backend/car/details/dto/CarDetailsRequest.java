package com.carlog.carlog_backend.car.details.dto;

import lombok.Data;

import java.util.List;

@Data
public class CarDetailsRequest {
    private MakeRequest makeRequest;
    private List<ModelRequest> modelRequests;
}
