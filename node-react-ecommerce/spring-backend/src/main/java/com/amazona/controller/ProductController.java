package com.amazona.controller;

import com.amazona.model.Product;
import com.amazona.model.Review;
import com.amazona.repository.ProductRepository;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/products")
@CrossOrigin
public class ProductController {

    private final ProductRepository productRepository;

    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @GetMapping
    public ResponseEntity<List<Product>> getProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String searchKeyword,
            @RequestParam(required = false) String sortOrder) {

        Sort sort = Sort.by(Sort.Direction.DESC, "id");
        if ("lowest".equalsIgnoreCase(sortOrder)) {
            sort = Sort.by(Sort.Direction.ASC, "price");
        } else if ("highest".equalsIgnoreCase(sortOrder)) {
            sort = Sort.by(Sort.Direction.DESC, "price");
        }

        List<Product> products;
        if (category != null && searchKeyword != null) {
            products = productRepository.findByCategoryIgnoreCaseAndNameContainingIgnoreCase(category, searchKeyword, sort);
        } else if (category != null) {
            products = productRepository.findByCategoryIgnoreCase(category, sort);
        } else if (searchKeyword != null) {
            products = productRepository.findByNameContainingIgnoreCase(searchKeyword, sort);
        } else {
            products = productRepository.findAll(sort);
        }

        if (products.isEmpty()) {
            products = seedInitialProducts();
        }

        return ResponseEntity.ok(products);
    }

    @GetMapping("/seed")
    public ResponseEntity<?> seedProducts() {
        productRepository.deleteAll();
        List<Product> created = seedInitialProducts();
        Map<String, Object> res = new HashMap<>();
        res.put("message", created.size() + " products seeded successfully!");
        res.put("data", created);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable String id) {
        Optional<Product> productOpt = productRepository.findById(id);
        if (productOpt.isPresent()) {
            return ResponseEntity.ok(productOpt.get());
        }

        // Fallback search by id or name from seed dataset
        List<Product> seeds = seedInitialProducts();
        Optional<Product> seedMatch = seeds.stream()
                .filter(p -> p.getId().equalsIgnoreCase(id) || p.getName().equalsIgnoreCase(id))
                .findFirst();
        if (seedMatch.isPresent()) {
            return ResponseEntity.ok(seedMatch.get());
        }

        Map<String, String> response = new HashMap<>();
        response.put("message", "Product Not Found.");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @PostMapping("/{id}/reviews")
    public ResponseEntity<?> createReview(@PathVariable String id, @RequestBody Map<String, Object> body) {
        Optional<Product> productOpt = productRepository.findById(id);
        if (productOpt.isPresent()) {
            Product product = productOpt.get();
            String name = (String) body.get("name");
            double rating = Double.parseDouble(body.get("rating").toString());
            String comment = (String) body.get("comment");

            Review review = new Review(name, rating, comment);
            product.getReviews().add(review);
            product.setNumReviews(product.getReviews().size());
            
            double sum = product.getReviews().stream().mapToDouble(Review::getRating).sum();
            product.setRating(sum / product.getReviews().size());

            Product updated = productRepository.save(product);
            
            Map<String, Object> response = new HashMap<>();
            response.put("data", review);
            response.put("message", "Review saved successfully.");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }

        Map<String, String> response = new HashMap<>();
        response.put("message", "Product Not Found");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @PostMapping
    public ResponseEntity<?> createProduct(@RequestBody Product product) {
        try {
            Product newProduct = productRepository.save(product);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "New Product Created");
            response.put("data", newProduct);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", " Error in Creating Product.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable String id, @RequestBody Product productReq) {
        Optional<Product> productOpt = productRepository.findById(id);
        if (productOpt.isPresent()) {
            Product p = productOpt.get();
            p.setName(productReq.getName());
            p.setPrice(productReq.getPrice());
            p.setImage(productReq.getImage());
            p.setBrand(productReq.getBrand());
            p.setCategory(productReq.getCategory());
            p.setCountInStock(productReq.getCountInStock());
            p.setDescription(productReq.getDescription());

            Product updated = productRepository.save(p);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Product Updated");
            response.put("data", updated);
            return ResponseEntity.ok(response);
        }

        Map<String, String> response = new HashMap<>();
        response.put("message", " Error in Updating Product.");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable String id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Product Deleted");
            return ResponseEntity.ok(response);
        }
        Map<String, String> response = new HashMap<>();
        response.put("message", "Error in Deletion.");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    private List<Product> seedInitialProducts() {
        List<Product> seeds = Arrays.asList(
            new Product("1", "Urban Slim Fit Shirt", "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&q=80", "Nike", 1199, "Shirts", 18, "A modern slim-fit shirt crafted from premium breathable cotton. Perfect for both casual and semi-formal occasions.", 4.5, 127),
            new Product("2", "Classic Oxford Shirt", "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=600&q=80", "Ralph Lauren", 1499, "Shirts", 25, "A timeless Oxford shirt with a tailored fit. A wardrobe essential that works from Monday meetings to weekend brunches.", 4.3, 89),
            new Product("3", "Linen Summer Shirt", "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80", "Zara", 1599, "Shirts", 12, "Light and breathable linen shirt, perfect for hot summer days. Features a relaxed fit and minimal design.", 4.1, 54),
            new Product("4", "Graphic Print Tee", "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80", "H&M", 699, "Shirts", 50, "Express yourself with this bold graphic tee. Made from 100% organic cotton for maximum comfort.", 4.0, 212),
            new Product("5", "Slim Chino Pants", "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80", "Levi's", 1799, "Pants", 20, "Versatile slim-fit chinos that bridge the gap between casual and smart casual. Available in multiple colors.", 4.6, 178),
            new Product("6", "Jogger Sweatpants", "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&q=80", "Adidas", 1599, "Pants", 35, "Premium fleece joggers with a modern tapered fit. Perfect for workouts, lounging, or running errands in style.", 4.4, 93),
            new Product("7", "Cargo Utility Pants", "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=600&q=80", "Carhartt", 3199, "Pants", 15, "Durable cargo pants with multiple pockets for maximum utility. Built tough for both work and adventure.", 4.7, 65),
            new Product("8", "Running Sneakers Pro", "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80", "Nike", 699, "Shoes", 22, "High-performance running shoes with advanced cushioning technology and a breathable mesh upper.", 4.8, 342),
            new Product("9", "Classic White Leather Shoes", "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80", "Adidas", 1999, "Shoes", 30, "Iconic clean white sneakers with premium leather upper. A timeless silhouette that goes with everything.", 4.5, 188),
            new Product("10", "Hiking Boots", "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600&q=80", "Timberland", 1999, "Shoes", 10, "Waterproof hiking boots with ankle support and a grippy sole. Ready for any terrain.", 4.6, 77),
            new Product("11", "Polarized Sunglasses", "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80", "Ray-Ban", 499, "Accessories", 25, "Classic style sunglasses with 100% UV protection and high quality polarized lenses.", 4.6, 88),
            new Product("12", "Minimalist Watch", "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80", "Peter England", 1999, "Accessories", 8, "A sleek, minimalist watch with a rose gold case and a genuine leather strap. Timeless elegance on your wrist.", 4.7, 523)
        );
        try {
            return productRepository.saveAll(seeds);
        } catch (Exception e) {
            return seeds;
        }
    }
}
