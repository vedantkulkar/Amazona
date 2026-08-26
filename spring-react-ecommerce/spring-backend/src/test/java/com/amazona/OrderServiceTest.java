package com.amazona;

import com.amazona.exception.ResourceNotFoundException;
import com.amazona.model.Order;
import com.amazona.repository.OrderRepository;
import com.amazona.service.OrderServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private com.amazona.repository.UserRepository userRepository;

    @InjectMocks
    private OrderServiceImpl orderService;

    private Order testOrder;

    @BeforeEach
    void setUp() {
        testOrder = new Order();
        testOrder.setId("ord_1");
        testOrder.setUser("usr_1");
        testOrder.setTotalPrice(199.99);
        testOrder.setOrderStatus("Processing");
    }

    @Test
    void testGetAllOrders_Success() {
        when(orderRepository.findAll(any(Sort.class))).thenReturn(Collections.singletonList(testOrder));

        List<Order> orders = orderService.getAllOrders();

        assertNotNull(orders);
        assertEquals(1, orders.size());
        verify(orderRepository, times(1)).findAll(any(Sort.class));
    }

    @Test
    void testGetOrderById_Success() {
        when(orderRepository.findById("ord_1")).thenReturn(Optional.of(testOrder));

        Order order = orderService.getOrderById("ord_1");

        assertNotNull(order);
        assertEquals("ord_1", order.getId());
    }

    @Test
    void testGetOrderById_NotFound_ThrowsException() {
        when(orderRepository.findById("invalid")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> orderService.getOrderById("invalid"));
    }

    @Test
    void testPayOrder_Success() {
        when(orderRepository.findById("ord_1")).thenReturn(Optional.of(testOrder));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Order paid = orderService.payOrder("ord_1", Collections.emptyMap());

        assertTrue(paid.isPaid());
        assertEquals("Paid", paid.getOrderStatus());
        assertNotNull(paid.getPaidAt());
    }

    @Test
    void testCancelOrder_Success() {
        when(orderRepository.findById("ord_1")).thenReturn(Optional.of(testOrder));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Order canceled = orderService.cancelOrder("ord_1", "Changed my mind");

        assertTrue(canceled.isCanceled());
        assertEquals("Cancelled", canceled.getOrderStatus());
        assertEquals("Changed my mind", canceled.getCancelReason());
    }

    @Test
    void testGetOrderSummary_Success() {
        when(orderRepository.findAll()).thenReturn(Collections.singletonList(testOrder));
        when(userRepository.count()).thenReturn(5L);

        java.util.Map<String, Object> summary = orderService.getOrderSummary();

        assertNotNull(summary);
        assertEquals(5L, summary.get("usersCount"));
        assertEquals(1, summary.get("ordersCount"));
    }
}
