package com.amazona.service;

import com.amazona.dto.CreateReviewRequest;
import com.amazona.model.Product;
import com.amazona.model.Review;

import java.util.List;

public interface ProductService {
    List<Product> getAllProducts(String category, String searchKeyword, String sortOrder);
    Product getProductById(String id);
    List<Product> seedProducts();
    Product createProduct(Product product);
    Product updateProduct(String id, Product product);
    void deleteProduct(String id);
    Review createProductReview(String id, CreateReviewRequest request, String reviewerName);
}
