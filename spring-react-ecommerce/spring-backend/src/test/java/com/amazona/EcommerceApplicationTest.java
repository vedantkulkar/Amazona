package com.amazona;

import com.amazona.controller.OrderController;
import com.amazona.controller.ProductController;
import com.amazona.controller.UserController;
import com.amazona.repository.OrderRepository;
import com.amazona.repository.ProductRepository;
import com.amazona.repository.UserRepository;
import com.amazona.service.OrderService;
import com.amazona.service.ProductService;
import com.amazona.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest(properties = "spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.data.mongo.MongoDataAutoConfiguration,org.springframework.boot.autoconfigure.mongo.MongoAutoConfiguration")
class EcommerceApplicationTest {

    @MockBean
    private ProductRepository productRepository;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private OrderRepository orderRepository;

    @Autowired
    private ProductController productController;

    @Autowired
    private UserController userController;

    @Autowired
    private OrderController orderController;

    @Autowired
    private ProductService productService;

    @Autowired
    private UserService userService;

    @Autowired
    private OrderService orderService;

    @Test
    void contextLoads() {
        assertNotNull(productController);
        assertNotNull(userController);
        assertNotNull(orderController);
        assertNotNull(productService);
        assertNotNull(userService);
        assertNotNull(orderService);
    }
}
