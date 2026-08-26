package com.amazona.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/config")
@CrossOrigin
@Tag(name = "Configuration", description = "Endpoints for fetching public integrations configuration")
public class ConfigController {

    @Value("${paypal.client.id:sb}")
    private String paypalClientId;

    @GetMapping("/paypal")
    @Operation(summary = "Get PayPal client ID")
    public String getPaypalClientId() {
        return paypalClientId;
    }
}
