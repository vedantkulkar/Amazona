package com.amazona.controller;

import com.amazona.dto.CreateReviewRequest;
import com.amazona.model.Product;
import com.amazona.model.Review;
import com.amazona.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@CrossOrigin
@Tag(name = "Product Management", description = "Endpoints for retrieving, creating, updating, deleting, and reviewing products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    @Operation(summary = "Get all products with optional category, search keyword, and sorting")
    public ResponseEntity<List<Product>> getProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String searchKeyword,
            @RequestParam(required = false) String sortOrder) {
        return ResponseEntity.ok(productService.getAllProducts(category, searchKeyword, sortOrder));
    }

    @GetMapping("/seed")
    @Operation(summary = "Re-seed the products dataset")
    public ResponseEntity<?> seedProducts() {
        List<Product> created = productService.seedProducts();
        Map<String, Object> res = new HashMap<>();
        res.put("message", created.size() + " products seeded successfully!");
        res.put("data", created);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get product details by ID")
    public ResponseEntity<Product> getProductById(@PathVariable String id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @PostMapping("/{id}/reviews")
    @Operation(summary = "Create a product review")
    public ResponseEntity<?> createReview(@PathVariable String id, @Valid @RequestBody CreateReviewRequest reviewRequest) {
        String currentUserName = getCurrentUserName();
        Review review = productService.createProductReview(id, reviewRequest, currentUserName);
        
        Map<String, Object> response = new HashMap<>();
        response.put("data", review);
        response.put("message", "Review saved successfully.");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping
    @Operation(summary = "Create a new product (Admin)")
    public ResponseEntity<?> createProduct(@RequestBody Product product) {
        Product newProduct = productService.createProduct(product);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "New Product Created");
        response.put("data", newProduct);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing product (Admin)")
    public ResponseEntity<?> updateProduct(@PathVariable String id, @RequestBody Product productReq) {
        Product updated = productService.updateProduct(id, productReq);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Product Updated");
        response.put("data", updated);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a product by ID (Admin)")
    public ResponseEntity<?> deleteProduct(@PathVariable String id) {
        productService.deleteProduct(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Product Deleted");
        return ResponseEntity.ok(response);
    }

    @SuppressWarnings("unchecked")
    private String getCurrentUserName() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof Map) {
            Map<String, Object> principal = (Map<String, Object>) auth.getPrincipal();
            return (String) principal.get("name");
        }
        return null;
    }
}
