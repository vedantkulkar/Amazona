package com.amazona.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "products")
public class Product {

    @Id
    @JsonProperty("_id")
    private String id;
    private String name;
    private String image;
    private String brand;
    private double price;
    private String category;
    private int countInStock;
    private String description;
    private double rating;
    private int numReviews;
    private List<Review> reviews = new ArrayList<>();

    public Product() {}

    public Product(String id, String name, String image, String brand, double price, String category, int countInStock, String description, double rating, int numReviews) {
        this.id = id;
        this.name = name;
        this.image = image;
        this.brand = brand;
        this.price = price;
        this.category = category;
        this.countInStock = countInStock;
        this.description = description;
        this.rating = rating;
        this.numReviews = numReviews;
    }

    @JsonProperty("_id")
    public String get_id() {
        return id;
    }

    @JsonProperty("_id")
    public void set_id(String _id) {
        this.id = _id;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public int getCountInStock() {
        return countInStock;
    }

    public void setCountInStock(int countInStock) {
        this.countInStock = countInStock;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public int getNumReviews() {
        return numReviews;
    }

    public void setNumReviews(int numReviews) {
        this.numReviews = numReviews;
    }

    public List<Review> getReviews() {
        return reviews;
    }

    public void setReviews(List<Review> reviews) {
        this.reviews = reviews;
    }
}
