package com.carlog.carlog_backend.car.service;

import com.carlog.carlog_backend._exception_handler.exceptions.ForbiddenException;
import com.carlog.carlog_backend._exception_handler.exceptions.NotFoundException;
import com.carlog.carlog_backend.car._details.entity.Model;
import com.carlog.carlog_backend.car._details.repository.ModelRepository;
import com.carlog.carlog_backend.car._odometer.entity.Odometer;
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
        Odometer odometer = new Odometer();

        car.setOwnerId(ownerId);
        car.setName(request.getName());
        car.setModel(model);
        car.setModelYear(request.getModelYear());
        car.setOdometer(odometer);
        car.setImageUrl(request.getImageUrl());
        car.setCreatedAt(Instant.now());

        odometer.setCar(car);
        odometer.setValue(request.getOdometer().getValue());
        odometer.setMeasurement(request.getOdometer().getMeasurement());

        Car savedCar = carRepository.save(car);
        return carMapper.toCarDto(savedCar);
    }

    public CarDto updateCar(UUID id, CarRequest request) {
        Car car = getUserCar(id);

        if (request.getName() != null) car.setName(request.getName());
        if (request.getModelId() != null) {
            Model model = modelRepository.findById(request.getModelId()).orElseThrow(() -> new NotFoundException("Model not found"));
            car.setModel(model);
        }
        if (request.getModelYear() != null) car.setModelYear(request.getModelYear());
        if (request.getImageUrl() != null) car.setImageUrl(request.getImageUrl());

        Car savedCar = carRepository.save(car);

        return carMapper.toCarDto(savedCar);
    }

    public void deleteCar(UUID id) {
        Car car = getUserCar(id);
        carRepository.delete(car);
    }

    private Car getUserCar(UUID carId) {
        UUID sessionUserId = Objects.requireNonNull(AuthenticatedUser()).getUserDto().getId();
        Car car = carRepository.findById(carId).orElseThrow(() -> new NotFoundException("Car not found"));

        if (!sessionUserId.equals(car.getOwnerId())) throw new ForbiddenException("This is not your car");

        return car;
    }
}
