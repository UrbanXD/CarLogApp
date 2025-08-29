package com.carlog.carlog_backend.car.controller;

import com.carlog.carlog_backend.car.dto.CarDto;
import com.carlog.carlog_backend.car.dto.CarRequest;
import com.carlog.carlog_backend.car.service.CarService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/car")
@RequiredArgsConstructor
public class CarController {
    private final CarService carService;

    @GetMapping("/all")
    public ResponseEntity<List<CarDto>> getAllCar() {
        return ResponseEntity.ok(carService.getAllUserCars());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CarDto> getCar(@PathVariable UUID id) {
        return ResponseEntity.ok(carService.getCarById(id));
    }

    @PostMapping("/add")
    public ResponseEntity<CarDto> addCar(@RequestBody CarRequest request) {
        CarDto car = carService.createCar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(car);
    }
}
