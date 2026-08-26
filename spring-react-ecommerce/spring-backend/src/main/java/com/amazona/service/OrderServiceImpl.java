package com.amazona.service;

import com.amazona.exception.BadRequestException;
import com.amazona.exception.ResourceNotFoundException;
import com.amazona.model.Order;
import com.amazona.model.Payment;
import com.amazona.repository.OrderRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final com.amazona.repository.UserRepository userRepository;

    public OrderServiceImpl(OrderRepository orderRepository, com.amazona.repository.UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    @Override
    public List<Order> getOrdersByUser(String userId) {
        if (userId == null) {
            throw new BadRequestException("User ID must not be null");
        }
        return orderRepository.findByUser(userId, Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    @Override
    public Order getOrderById(String id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
    }

    @Override
    public Order createOrder(Order order, String currentUserId) {
        if (currentUserId != null) {
            order.setUser(currentUserId);
        }
        order.setOrderStatus("Processing");
        order.setCreatedAt(LocalDateTime.now());
        return orderRepository.save(order);
    }

    @Override
    public Order payOrder(String id, Map<String, Object> paymentResult) {
        Order order = getOrderById(id);
        order.setPaid(true);
        order.setPaidAt(LocalDateTime.now());
        order.setOrderStatus("Paid");

        // Persist payment result details (transactionId, payer info, status)
        if (paymentResult != null) {
            Payment payment = order.getPayment() != null ? order.getPayment() : new Payment();
            if (paymentResult.get("paymentMethod") != null) {
                payment.setPaymentMethod(paymentResult.get("paymentMethod").toString());
            }
            // Store transaction / order ID from PayPal or payment gateway
            String txnId = paymentResult.getOrDefault("orderID",
                    paymentResult.getOrDefault("paymentID",
                    paymentResult.getOrDefault("transactionId", ""))).toString();
            payment.setTransactionId(txnId);

            Object payerEmail = paymentResult.get("payerEmail");
            if (payerEmail != null) payment.setPayerEmail(payerEmail.toString());

            Object payerName = paymentResult.get("payerName");
            if (payerName != null) payment.setPayerName(payerName.toString());

            Object status = paymentResult.get("status");
            payment.setStatus(status != null ? status.toString() : "COMPLETED");

            order.setPayment(payment);
        }

        return orderRepository.save(order);
    }

    @Override
    public Order deliverOrder(String id) {
        Order order = getOrderById(id);
        order.setDelivered(true);
        order.setDeliveredAt(LocalDateTime.now());
        order.setOrderStatus("Delivered");
        return orderRepository.save(order);
    }

    @Override
    public Order cancelOrder(String id, String reason) {
        Order order = getOrderById(id);
        if (order.isCanceled()) {
            throw new BadRequestException("Order is already canceled.");
        }
        order.setCanceled(true);
        order.setCanceledAt(LocalDateTime.now());
        order.setCancelReason(reason != null ? reason : "Cancelled by user");
        order.setOrderStatus("Cancelled");
        return orderRepository.save(order);
    }

    @Override
    public Order returnOrder(String id, String returnType, String returnReason) {
        Order order = getOrderById(id);
        order.setReturned(true);
        order.setReturnedAt(LocalDateTime.now());
        order.setReturnType(returnType != null ? returnType : "return");
        order.setReturnReason(returnReason != null ? returnReason : "Customer requested return/replacement");

        if ("replace".equalsIgnoreCase(returnType)) {
            order.setOrderStatus("Replacement Requested");
        } else {
            order.setOrderStatus("Return Requested");
        }

        return orderRepository.save(order);
    }

    @Override
    public Order deleteOrder(String id) {
        Order order = getOrderById(id);
        orderRepository.deleteById(id);
        return order;
    }

    @Override
    public Map<String, Object> getOrderSummary() {
        List<Order> orders = orderRepository.findAll();
        long usersCount = userRepository.count();
        java.time.LocalDate today = java.time.LocalDate.now();

        // 1. Core Totals
        long paidOrdersCount = orders.stream().filter(Order::isPaid).count();
        double totalSales = orders.stream()
                .filter(Order::isPaid)
                .mapToDouble(Order::getTotalPrice)
                .sum();

        // 2. Today's Metrics
        long todayOrdersCount = orders.stream()
                .filter(o -> o.getCreatedAt() != null && o.getCreatedAt().toLocalDate().isEqual(today))
                .count();

        double todaySales = orders.stream()
                .filter(o -> o.getCreatedAt() != null && o.getCreatedAt().toLocalDate().isEqual(today) && o.isPaid())
                .mapToDouble(Order::getTotalPrice)
                .sum();

        double avgOrderValue = paidOrdersCount > 0 ? (totalSales / paidOrdersCount) : 0.0;

        // 3. Payment Method Breakdown (UPI, NetBanking/Cards, COD)
        long upiCount = 0; double upiSales = 0;
        long netbankingCount = 0; double netbankingSales = 0;
        long codCount = 0; double codSales = 0;

        for (Order o : orders) {
            String method = (o.getPayment() != null && o.getPayment().getPaymentMethod() != null)
                    ? o.getPayment().getPaymentMethod().toLowerCase()
                    : "cod";
            double amount = o.getTotalPrice();

            if (method.contains("upi")) {
                upiCount++;
                if (o.isPaid()) upiSales += amount;
            } else if (method.contains("netbanking") || method.contains("card")) {
                netbankingCount++;
                if (o.isPaid()) netbankingSales += amount;
            } else {
                codCount++;
                if (o.isPaid()) codSales += amount;
            }
        }

        long totalMethods = upiCount + netbankingCount + codCount;
        Map<String, Object> paymentStats = new java.util.HashMap<>();
        
        Map<String, Object> upiStats = new java.util.HashMap<>();
        upiStats.put("count", upiCount);
        upiStats.put("sales", Math.round(upiSales));
        upiStats.put("percentage", totalMethods > 0 ? Math.round((upiCount * 100.0) / totalMethods) : 0);
        paymentStats.put("upi", upiStats);

        Map<String, Object> cardStats = new java.util.HashMap<>();
        cardStats.put("count", netbankingCount);
        cardStats.put("sales", Math.round(netbankingSales));
        cardStats.put("percentage", totalMethods > 0 ? Math.round((netbankingCount * 100.0) / totalMethods) : 0);
        paymentStats.put("netbanking", cardStats);

        Map<String, Object> codStats = new java.util.HashMap<>();
        codStats.put("count", codCount);
        codStats.put("sales", Math.round(codSales));
        codStats.put("percentage", totalMethods > 0 ? Math.round((codCount * 100.0) / totalMethods) : 0);
        paymentStats.put("cod", codStats);

        // 4. Order Status Breakdown
        long processingCount = orders.stream().filter(o -> !o.isCanceled() && !o.isReturned() && !o.isDelivered() && !"Delivered".equalsIgnoreCase(o.getOrderStatus())).count();
        long deliveredCount = orders.stream().filter(o -> o.isDelivered() || "Delivered".equalsIgnoreCase(o.getOrderStatus())).count();
        long canceledCount = orders.stream().filter(o -> o.isCanceled() || "Cancelled".equalsIgnoreCase(o.getOrderStatus())).count();
        long returnedCount = orders.stream().filter(o -> o.isReturned() || "Return Requested".equalsIgnoreCase(o.getOrderStatus()) || "Replacement Requested".equalsIgnoreCase(o.getOrderStatus())).count();

        Map<String, Object> statusStats = new java.util.HashMap<>();
        statusStats.put("processing", processingCount);
        statusStats.put("delivered", deliveredCount);
        statusStats.put("canceled", canceledCount);
        statusStats.put("returned", returnedCount);

        // 5. Demanded / Top Selling Products (Grouped by product name)
        Map<String, Map<String, Object>> productDemandMap = new java.util.HashMap<>();
        for (Order o : orders) {
            if (o.getOrderItems() != null) {
                for (com.amazona.model.OrderItem item : o.getOrderItems()) {
                    String pName = item.getName() != null ? item.getName() : "Item";
                    productDemandMap.computeIfAbsent(pName, k -> {
                        Map<String, Object> map = new java.util.HashMap<>();
                        map.put("name", pName);
                        map.put("image", item.getImage());
                        map.put("unitsSold", 0);
                        map.put("revenue", 0.0);
                        map.put("product", item.getProduct());
                        return map;
                    });
                    Map<String, Object> map = productDemandMap.get(pName);
                    int currentQty = (int) map.get("unitsSold") + item.getQty();
                    double currentRev = (double) map.get("revenue") + (item.getPrice() * item.getQty());
                    map.put("unitsSold", currentQty);
                    map.put("revenue", (double) Math.round(currentRev));
                }
            }
        }

        List<Map<String, Object>> demandedProducts = productDemandMap.values().stream()
                .sorted((a, b) -> Integer.compare((int) b.get("unitsSold"), (int) a.get("unitsSold")))
                .limit(10)
                .map(m -> {
                    int units = (int) m.get("unitsSold");
                    String badge = units >= 10 ? "🔥 Hot Demand" : (units >= 4 ? "⚡ High Demand" : "⭐ Trending");
                    m.put("demandBadge", badge);
                    return m;
                })
                .collect(java.util.stream.Collectors.toList());

        // 6. Last 7 Days Daily Sales Trend
        List<Map<String, Object>> dailySalesTrend = new java.util.ArrayList<>();
        java.time.format.DateTimeFormatter dayFmt = java.time.format.DateTimeFormatter.ofPattern("dd MMM");
        for (int i = 6; i >= 0; i--) {
            java.time.LocalDate d = today.minusDays(i);
            String label = d.format(dayFmt);
            double daySales = orders.stream()
                    .filter(o -> o.getCreatedAt() != null && o.getCreatedAt().toLocalDate().isEqual(d) && o.isPaid())
                    .mapToDouble(Order::getTotalPrice)
                    .sum();
            long dayOrders = orders.stream()
                    .filter(o -> o.getCreatedAt() != null && o.getCreatedAt().toLocalDate().isEqual(d))
                    .count();

            Map<String, Object> dayMap = new java.util.HashMap<>();
            dayMap.put("date", label);
            dayMap.put("sales", Math.round(daySales));
            dayMap.put("orders", dayOrders);
            dailySalesTrend.add(dayMap);
        }

        Map<String, Object> summary = new java.util.HashMap<>();
        summary.put("usersCount", usersCount);
        summary.put("ordersCount", orders.size());
        summary.put("paidOrdersCount", paidOrdersCount);
        summary.put("totalSales", Math.round(totalSales));
        summary.put("todayOrdersCount", todayOrdersCount);
        summary.put("todaySales", Math.round(todaySales));
        summary.put("avgOrderValue", Math.round(avgOrderValue));
        summary.put("paymentStats", paymentStats);
        summary.put("statusStats", statusStats);
        summary.put("demandedProducts", demandedProducts);
        summary.put("dailySalesTrend", dailySalesTrend);
        summary.put("orders", orders);
        return summary;
    }
}
