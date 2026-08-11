package com.amazona.controller;

import com.amazona.model.Order;
import com.amazona.repository.OrderRepository;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin
public class OrderController {

    private final OrderRepository orderRepository;

    public OrderController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @GetMapping
    public ResponseEntity<List<Order>> getOrders() {
        List<Order> orders = orderRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/mine")
    public ResponseEntity<List<Order>> getMyOrders() {
        String userId = getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<Order> orders = orderRepository.findByUser(userId, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable String id) {
        Optional<Order> orderOpt = orderRepository.findById(id);
        if (orderOpt.isPresent()) {
            return ResponseEntity.ok(orderOpt.get());
        }
        Map<String, String> response = new HashMap<>();
        response.put("message", "Order Not Found");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody Order order) {
        String userId = getCurrentUserId();
        if (userId != null) {
            order.setUser(userId);
        }
        order.setOrderStatus("Processing");
        order.setCreatedAt(LocalDateTime.now());

        Order newOrder = orderRepository.save(order);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "New Order Created");
        response.put("data", newOrder);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}/pay")
    public ResponseEntity<?> payOrder(@PathVariable String id, @RequestBody(required = false) Map<String, Object> paymentResult) {
        Optional<Order> orderOpt = orderRepository.findById(id);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            order.setPaid(true);
            order.setPaidAt(LocalDateTime.now());
            order.setOrderStatus("Paid");

            Order updatedOrder = orderRepository.save(order);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Order Paid.");
            response.put("order", updatedOrder);
            return ResponseEntity.ok(response);
        }
        Map<String, String> response = new HashMap<>();
        response.put("message", "Order Not Found.");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @PutMapping("/{id}/deliver")
    public ResponseEntity<?> deliverOrder(@PathVariable String id) {
        Optional<Order> orderOpt = orderRepository.findById(id);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            order.setDelivered(true);
            order.setDeliveredAt(LocalDateTime.now());
            order.setOrderStatus("Delivered");

            Order updatedOrder = orderRepository.save(order);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Order Delivered");
            response.put("order", updatedOrder);
            return ResponseEntity.ok(response);
        }
        Map<String, String> response = new HashMap<>();
        response.put("message", "Order Not Found.");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable String id, @RequestBody(required = false) Map<String, String> body) {
        Optional<Order> orderOpt = orderRepository.findById(id);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            order.setCanceled(true);
            order.setCanceledAt(LocalDateTime.now());
            String reason = body != null ? body.get("reason") : null;
            if (reason == null && body != null) reason = body.get("cancelReason");
            if (reason == null) reason = "Cancelled by user";
            order.setCancelReason(reason);
            order.setOrderStatus("Cancelled");

            Order updatedOrder = orderRepository.save(order);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Order Cancelled");
            response.put("order", updatedOrder);
            return ResponseEntity.ok(response);
        }
        Map<String, String> response = new HashMap<>();
        response.put("message", "Order Not Found.");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @PutMapping("/{id}/return")
    public ResponseEntity<?> returnOrder(@PathVariable String id, @RequestBody Map<String, String> body) {
        Optional<Order> orderOpt = orderRepository.findById(id);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            order.setReturned(true);
            order.setReturnedAt(LocalDateTime.now());
            
            String returnType = body.get("returnType");
            String returnReason = body.get("returnReason");
            order.setReturnType(returnType);
            order.setReturnReason(returnReason);

            if ("replace".equalsIgnoreCase(returnType)) {
                order.setOrderStatus("Replacement Requested");
            } else {
                order.setOrderStatus("Return Requested");
            }

            Order updatedOrder = orderRepository.save(order);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Return/Replacement Request Submitted");
            response.put("order", updatedOrder);
            return ResponseEntity.ok(response);
        }
        Map<String, String> response = new HashMap<>();
        response.put("message", "Order Not Found.");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable String id) {
        Optional<Order> orderOpt = orderRepository.findById(id);
        if (orderOpt.isPresent()) {
            orderRepository.deleteById(id);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Order Deleted");
            response.put("order", orderOpt.get());
            return ResponseEntity.ok(response);
        }
        Map<String, String> response = new HashMap<>();
        response.put("message", "Order Not Found.");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @SuppressWarnings("unchecked")
    private String getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof Map) {
            Map<String, Object> principal = (Map<String, Object>) auth.getPrincipal();
            return (String) principal.get("_id");
        }
        return null;
    }
}
