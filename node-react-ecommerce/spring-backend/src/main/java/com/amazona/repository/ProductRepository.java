package com.amazona.repository;

import com.amazona.model.Product;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ProductRepository extends MongoRepository<Product, String> {
    List<Product> findByCategoryIgnoreCase(String category, Sort sort);
    List<Product> findByNameContainingIgnoreCase(String searchKeyword, Sort sort);
    List<Product> findByCategoryIgnoreCaseAndNameContainingIgnoreCase(String category, String searchKeyword, Sort sort);
}
