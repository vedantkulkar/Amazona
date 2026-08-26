package com.amazona.repository;

import com.amazona.model.Order;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findByUser(String userId, Sort sort);
    List<Order> findAll(Sort sort);
}
