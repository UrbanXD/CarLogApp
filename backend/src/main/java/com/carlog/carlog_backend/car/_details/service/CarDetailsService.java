package com.carlog.carlog_backend.car._details.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class CarDetailsService {
    private final RestClient restClient;

    public CarDetailsService(RestClient.Builder builder) {
        this.restClient = builder.baseUrl("https://localhost:9001/startScraping").build();
    }

    @Scheduled(cron = "@monthly")
    public void startCarDetailScraping() {
        restClient.post();
    }
}
