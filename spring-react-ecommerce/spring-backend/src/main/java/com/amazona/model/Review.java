package com.amazona.model;

import java.time.LocalDateTime;

public class Review {

    private String name;
    private double rating;
    private String comment;
    private LocalDateTime createdAt = LocalDateTime.now();

    public Review() {}

    public Review(String name, double rating, String comment) {
        this.name = name;
        this.rating = rating;
        this.comment = comment;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
