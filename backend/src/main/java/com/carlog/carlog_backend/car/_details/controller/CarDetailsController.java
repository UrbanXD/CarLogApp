package com.carlog.carlog_backend.car._details.controller;

import com.carlog.carlog_backend.car._details.service.MakeService;
import com.carlog.carlog_backend.car._details.service.ModelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/car/details")
public class CarDetailsController {
    private final MakeService makeService;
    private final ModelService modelService;

    @PutMapping("/deactivateDetails")
    public ResponseEntity<?> deactivateDetails() {
        modelService.deactivateAllModel();
        makeService.deactivateAllMake();

        return ResponseEntity.ok().build();
    }
}