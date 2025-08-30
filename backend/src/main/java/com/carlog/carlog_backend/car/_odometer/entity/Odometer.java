package com.carlog.carlog_backend.car._odometer.entity;

import com.carlog.carlog_backend.car._odometer.dto.OdometerMeasurementEnum;
import com.carlog.carlog_backend.car.entity.Car;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "odometer")
public class Odometer {
    @Id()
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne
    @JoinColumn(name = "car_id")
    private Car car;

    @Column(nullable = false)
    private Long value;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OdometerMeasurementEnum measurement;
}
