package com.carlog.carlog_backend.car._fuel_tank.repository;

import com.carlog.carlog_backend.car._fuel_tank.entity.FuelTank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface FuelTankRepository extends JpaRepository<FuelTank, UUID> {
}
