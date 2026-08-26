package com.amazona.controller;

import com.amazona.exception.UnauthorizedException;
import com.amazona.model.Order;
import com.amazona.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin
@Tag(name = "Order Management", description = "Endpoints for order creation, order tracking, payments, deliveries, cancellations, and returns")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    @Operation(summary = "Get all orders (Admin)")
    public ResponseEntity<List<Order>> getOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/summary")
    @Operation(summary = "Get order & revenue dashboard summary statistics (Admin)")
    public ResponseEntity<Map<String, Object>> getOrderSummary() {
        return ResponseEntity.ok(orderService.getOrderSummary());
    }

    @GetMapping("/mine")
    @Operation(summary = "Get current authenticated user orders")
    public ResponseEntity<List<Order>> getMyOrders() {
        String userId = getCurrentUserId();
        if (userId == null) {
            throw new UnauthorizedException("User is not authenticated");
        }
        return ResponseEntity.ok(orderService.getOrdersByUser(userId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get order details by ID")
    public ResponseEntity<Order> getOrderById(@PathVariable String id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @PostMapping
    @Operation(summary = "Create a new purchase order")
    public ResponseEntity<?> createOrder(@RequestBody Order order) {
        String userId = getCurrentUserId();
        Order newOrder = orderService.createOrder(order, userId);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "New Order Created");
        response.put("data", newOrder);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}/pay")
    @Operation(summary = "Mark order as paid")
    public ResponseEntity<?> payOrder(@PathVariable String id, @RequestBody(required = false) Map<String, Object> paymentResult) {
        Order updatedOrder = orderService.payOrder(id, paymentResult);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Order Paid.");
        response.put("order", updatedOrder);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/deliver")
    @Operation(summary = "Mark order as delivered (Admin)")
    public ResponseEntity<?> deliverOrder(@PathVariable String id) {
        Order updatedOrder = orderService.deliverOrder(id);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Order Delivered");
        response.put("order", updatedOrder);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/cancel")
    @Operation(summary = "Cancel an existing order")
    public ResponseEntity<?> cancelOrder(@PathVariable String id, @RequestBody(required = false) Map<String, String> body) {
        String reason = body != null ? body.get("reason") : null;
        if (reason == null && body != null) reason = body.get("cancelReason");
        
        Order updatedOrder = orderService.cancelOrder(id, reason);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Order Cancelled");
        response.put("order", updatedOrder);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/return")
    @Operation(summary = "Request order return or replacement")
    public ResponseEntity<?> returnOrder(@PathVariable String id, @RequestBody Map<String, String> body) {
        String returnType = body.get("returnType");
        String returnReason = body.get("returnReason");

        Order updatedOrder = orderService.returnOrder(id, returnType, returnReason);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Return/Replacement Request Submitted");
        response.put("order", updatedOrder);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an order (Admin)")
    public ResponseEntity<?> deleteOrder(@PathVariable String id) {
        Order deletedOrder = orderService.deleteOrder(id);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Order Deleted");
        response.put("order", deletedOrder);
        return ResponseEntity.ok(response);
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
