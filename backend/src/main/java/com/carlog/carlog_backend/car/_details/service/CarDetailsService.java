package com.carlog.carlog_backend.car._details.service;

import com.carlog.carlog_backend.car._details.dto.MakeDto;
import com.carlog.carlog_backend.car._details.dto.MakeRequest;
import com.carlog.carlog_backend.car._details.dto.ModelRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CarDetailsService {
    private final MakeService makeService;
    private final ModelService modelService;

    // cron = sec min hour day_of_month month day_of_week
    @Scheduled(cron = "0 0 3 1 * *")  // every month first day at 03:00
//    @Scheduled(fixedRate = 1500000000)
    public void startCarDetailScraping() {
        try {
            makeService.triggerMakeScraping();
        } catch (Exception ex) {
            System.err.println("Scraper call failed: " + ex.getMessage());
        }
    }

    @RabbitListener(queues = "${queue.name.make}")
    public void consumeMake(MakeRequest request) {
//        System.out.println("Received from RabbitMQ (make) : " + request);
        try {
            MakeDto make = makeService.upsertMake(request);
//            modelService.triggerModelScraping(make.getId());
        } catch (Exception e) {
            System.out.println("Make consume error: " + e.getMessage());
        }
    }

    @RabbitListener(queues = "${queue.name.model}")
    public void consumeModel(ModelRequest request) {
//        System.out.println("Received from RabbitMQ (model): " + request);
        try {
            modelService.upsertModel(request);
        } catch (Exception e) {
            System.out.println("Model consume error: " + e.getMessage());
        }
    }
}
