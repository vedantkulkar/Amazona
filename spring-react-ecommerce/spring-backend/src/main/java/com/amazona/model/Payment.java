package com.amazona.model;

public class Payment {
    private String paymentMethod;
    private String transactionId;   // PayPal orderID / UPI payment ID / Card ref
    private String payerEmail;      // PayPal payer email
    private String payerName;       // PayPal payer name
    private String status;          // COMPLETED, PENDING, etc.

    public Payment() {}

    public Payment(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

    public String getPayerEmail() { return payerEmail; }
    public void setPayerEmail(String payerEmail) { this.payerEmail = payerEmail; }

    public String getPayerName() { return payerName; }
    public void setPayerName(String payerName) { this.payerName = payerName; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
