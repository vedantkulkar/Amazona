package com.amazona.service;

import com.amazona.model.Order;

import java.util.List;
import java.util.Map;

public interface OrderService {
    List<Order> getAllOrders();
    List<Order> getOrdersByUser(String userId);
    Order getOrderById(String id);
    Order createOrder(Order order, String currentUserId);
    Order payOrder(String id, Map<String, Object> paymentResult);
    Order deliverOrder(String id);
    Order cancelOrder(String id, String reason);
    Order returnOrder(String id, String returnType, String returnReason);
    Order deleteOrder(String id);
    Map<String, Object> getOrderSummary();
}
