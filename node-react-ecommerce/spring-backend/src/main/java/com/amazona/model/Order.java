package com.amazona.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "orders")
public class Order {

    @Id
    @JsonProperty("_id")
    private String id;
    private String user; // User ID reference
    private List<OrderItem> orderItems = new ArrayList<>();
    private Shipping shipping;
    private Payment payment;
    private double itemsPrice;
    private double taxPrice;
    private double shippingPrice;
    private double totalPrice;
    
    @JsonProperty("isPaid")
    private boolean isPaid = false;
    private LocalDateTime paidAt;
    
    @JsonProperty("isDelivered")
    private boolean isDelivered = false;
    private LocalDateTime deliveredAt;
    
    @JsonProperty("isCanceled")
    private boolean isCanceled = false;
    private LocalDateTime canceledAt;
    private String cancelReason;

    @JsonProperty("isReturned")
    private boolean isReturned = false;
    private LocalDateTime returnedAt;
    private String returnType; // 'return' or 'replace'
    private String returnReason;

    private String orderStatus = "Processing";
    private LocalDateTime createdAt = LocalDateTime.now();

    public Order() {}

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

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public List<OrderItem> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }

    public Shipping getShipping() {
        return shipping;
    }

    public void setShipping(Shipping shipping) {
        this.shipping = shipping;
    }

    public Payment getPayment() {
        return payment;
    }

    public void setPayment(Payment payment) {
        this.payment = payment;
    }

    public double getItemsPrice() {
        return itemsPrice;
    }

    public void setItemsPrice(double itemsPrice) {
        this.itemsPrice = itemsPrice;
    }

    public double getTaxPrice() {
        return taxPrice;
    }

    public void setTaxPrice(double taxPrice) {
        this.taxPrice = taxPrice;
    }

    public double getShippingPrice() {
        return shippingPrice;
    }

    public void setShippingPrice(double shippingPrice) {
        this.shippingPrice = shippingPrice;
    }

    public double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(double totalPrice) {
        this.totalPrice = totalPrice;
    }

    @JsonProperty("isPaid")
    public boolean getIsPaid() {
        return isPaid;
    }

    @JsonProperty("paid")
    public boolean isPaid() {
        return isPaid;
    }

    @JsonProperty("isPaid")
    public void setIsPaid(boolean paid) {
        isPaid = paid;
    }

    public void setPaid(boolean paid) {
        isPaid = paid;
    }

    public LocalDateTime getPaidAt() {
        return paidAt;
    }

    public void setPaidAt(LocalDateTime paidAt) {
        this.paidAt = paidAt;
    }

    @JsonProperty("isDelivered")
    public boolean getIsDelivered() {
        return isDelivered;
    }

    @JsonProperty("delivered")
    public boolean isDelivered() {
        return isDelivered;
    }

    @JsonProperty("isDelivered")
    public void setIsDelivered(boolean delivered) {
        isDelivered = delivered;
    }

    public void setDelivered(boolean delivered) {
        isDelivered = delivered;
    }

    public LocalDateTime getDeliveredAt() {
        return deliveredAt;
    }

    public void setDeliveredAt(LocalDateTime deliveredAt) {
        this.deliveredAt = deliveredAt;
    }

    @JsonProperty("isCanceled")
    public boolean getIsCanceled() {
        return isCanceled;
    }

    @JsonProperty("canceled")
    public boolean isCanceled() {
        return isCanceled;
    }

    @JsonProperty("isCanceled")
    public void setIsCanceled(boolean canceled) {
        isCanceled = canceled;
    }

    public void setCanceled(boolean canceled) {
        isCanceled = canceled;
    }

    public LocalDateTime getCanceledAt() {
        return canceledAt;
    }

    public void setCanceledAt(LocalDateTime canceledAt) {
        this.canceledAt = canceledAt;
    }

    public String getCancelReason() {
        return cancelReason;
    }

    public void setCancelReason(String cancelReason) {
        this.cancelReason = cancelReason;
    }

    @JsonProperty("isReturned")
    public boolean getIsReturned() {
        return isReturned;
    }

    @JsonProperty("returned")
    public boolean isReturned() {
        return isReturned;
    }

    @JsonProperty("isReturned")
    public void setIsReturned(boolean returned) {
        isReturned = returned;
    }

    public void setReturned(boolean returned) {
        isReturned = returned;
    }

    public LocalDateTime getReturnedAt() {
        return returnedAt;
    }

    public void setReturnedAt(LocalDateTime returnedAt) {
        this.returnedAt = returnedAt;
    }

    public String getReturnType() {
        return returnType;
    }

    public void setReturnType(String returnType) {
        this.returnType = returnType;
    }

    public String getReturnReason() {
        return returnReason;
    }

    public void setReturnReason(String returnReason) {
        this.returnReason = returnReason;
    }

    public String getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(String orderStatus) {
        this.orderStatus = orderStatus;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
