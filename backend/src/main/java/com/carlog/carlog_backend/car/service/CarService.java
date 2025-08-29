package com.carlog.carlog_backend.car.service;

import com.carlog.carlog_backend._exception_handler.exceptions.NotFoundException;
import com.carlog.carlog_backend.car._details.entity.Model;
import com.carlog.carlog_backend.car._details.repository.ModelRepository;
import com.carlog.carlog_backend.car.dto.CarDto;
import com.carlog.carlog_backend.car.dto.CarRequest;
import com.carlog.carlog_backend.car.entity.Car;
import com.carlog.carlog_backend.car.mapper.CarMapper;
import com.carlog.carlog_backend.car.repository.CarRepository;
import com.carlog.carlog_backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

import static com.carlog.carlog_backend.user.auth.JwtAuthFilter.AuthenticatedUser;

@Service
@RequiredArgsConstructor
public class CarService {
    private final CarRepository carRepository;
    private final CarMapper carMapper;
    private final UserRepository userRepository;
    private final ModelRepository modelRepository;

    public List<CarDto> getAllUserCars() {
        UUID ownerId = Objects.requireNonNull(AuthenticatedUser()).getUserDto().getId();
        List<Car> cars = carRepository.findAllByOwnerId(ownerId);
        return carMapper.toCarDtoList(cars);
    }

    public CarDto getCarById(UUID id) {
        Car car = carRepository.findById(id).orElseThrow(() -> new NotFoundException("Car not found"));
        return carMapper.toCarDto(car);
    }

    public CarDto createCar(CarRequest request) {
        UUID ownerId = Objects.requireNonNull(AuthenticatedUser()).getUserDto().getId();
        Model model = modelRepository.findById(request.getModelId()).orElseThrow(() -> new NotFoundException("Model not found"));

        Car car = new Car();
        car.setOwnerId(ownerId);
        car.setName(request.getName());
        car.setModel(model);
        car.setModelYear(request.getModelYear());
        car.setImageUrl(request.getImageUrl());
        car.setCreatedAt(Instant.now());

        Car savedCar = carRepository.save(car);
        return carMapper.toCarDto(savedCar);
    }
}
