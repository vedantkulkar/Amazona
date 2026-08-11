package com.amazona.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/config")
@CrossOrigin
public class ConfigController {

    @Value("${paypal.client.id:sb}")
    private String paypalClientId;

    @GetMapping("/paypal")
    public String getPaypalClientId() {
        return paypalClientId;
    }
}
