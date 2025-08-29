package com.carlog.carlog_backend.car.repository;

import com.carlog.carlog_backend.car.entity.Car;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CarRepository extends JpaRepository<Car, UUID> {
    List<Car> findAllByOwnerId(UUID id);
}
