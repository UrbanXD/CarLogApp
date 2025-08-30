package com.carlog.carlog_backend.car._odometer.repository;

import com.carlog.carlog_backend.car._odometer.entity.Odometer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface OdometerRepository extends JpaRepository<Odometer, UUID> {
}
