package com.carlog.carlog_backend.car._fuel_tank.entity;

import com.carlog.carlog_backend.car._fuel_tank.dto.FuelTankMeasurementType;
import com.carlog.carlog_backend.car._fuel_tank.dto.FuelTankType;
import com.carlog.carlog_backend.car.entity.Car;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "fuel_tank")
public class FuelTank {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "car_id", nullable = false, updatable = false)
    private Car car;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 24)
    private FuelTankType type;

    @Column(nullable = false)
    private Long capacity;

    @Column(nullable = false)
    private Long value;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 3)
    private FuelTankMeasurementType measurement;
}
