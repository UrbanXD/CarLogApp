package com.carlog.carlog_backend.car.details.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "model")
public class Model {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "make_id", nullable = false)
    private Make make;

    @Column(unique = true)
    private String name;

    @Column(name = "start_year", nullable = false, length = 4)
    private String startYear;

    @Column(name = "end_year", length = 4)
    private String endYear;

    @Column(nullable = false)
    private Boolean active;
}
