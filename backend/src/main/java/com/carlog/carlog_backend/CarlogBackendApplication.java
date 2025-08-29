package com.carlog.carlog_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CarlogBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(CarlogBackendApplication.class, args);
    }

}
