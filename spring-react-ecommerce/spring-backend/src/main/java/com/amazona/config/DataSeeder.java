package com.amazona.config;

import com.amazona.model.Order;
import com.amazona.model.OrderItem;
import com.amazona.model.Payment;
import com.amazona.model.Shipping;
import com.amazona.repository.OrderRepository;
import com.amazona.service.ProductService;
import com.amazona.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataSeeder.class);

    private final ProductService productService;
    private final UserService userService;
    private final OrderRepository orderRepository;

    public DataSeeder(ProductService productService, UserService userService, OrderRepository orderRepository) {
        this.productService = productService;
        this.userService = userService;
        this.orderRepository = orderRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        logger.info("Initializing Amazona E-Commerce data seeder...");
        try {
            userService.createAdminUser();
            logger.info("Admin user check/seeding complete.");
            productService.getAllProducts(null, null, null);
            logger.info("Product database check/seeding complete.");

            seedInitialOrdersIfEmpty();
        } catch (Exception e) {
            logger.warn("Data seeder execution warning: {}", e.getMessage());
        }
    }

    private void seedInitialOrdersIfEmpty() {
        try {
            if (orderRepository.count() == 0) {
                logger.info("Seeding initial demo orders for analytics dashboard...");

                // Order 1: Today, UPI, Delivered
                Order o1 = new Order();
                o1.setId("ord_today_101");
                o1.setUser("demo_user_1");
                o1.setOrderItems(Arrays.asList(
                    new OrderItem("Urban Slim Fit Shirt", 2, "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&q=80", 1199, "1"),
                    new OrderItem("Slim Chino Pants", 1, "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80", 1799, "5")
                ));
                o1.setShipping(new Shipping("42 Silicon Avenue", "Bengaluru", "560001", "India"));
                o1.setPayment(new Payment("upi"));
                o1.setItemsPrice(4197);
                o1.setTaxPrice(755);
                o1.setShippingPrice(0);
                o1.setTotalPrice(4952);
                o1.setPaid(true);
                o1.setPaidAt(LocalDateTime.now().minusHours(3));
                o1.setDelivered(true);
                o1.setDeliveredAt(LocalDateTime.now().minusHours(1));
                o1.setOrderStatus("Delivered");
                o1.setCreatedAt(LocalDateTime.now().minusHours(4));

                // Order 2: Today, NetBanking/Card, Paid (In Transit)
                Order o2 = new Order();
                o2.setId("ord_today_102");
                o2.setUser("demo_user_2");
                o2.setOrderItems(Collections.singletonList(
                    new OrderItem("Running Sneakers Pro", 2, "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80", 699, "8")
                ));
                o2.setShipping(new Shipping("108 Marine Drive", "Mumbai", "400020", "India"));
                o2.setPayment(new Payment("netbanking"));
                o2.setItemsPrice(1398);
                o2.setTaxPrice(252);
                o2.setShippingPrice(149);
                o2.setTotalPrice(1799);
                o2.setPaid(true);
                o2.setPaidAt(LocalDateTime.now().minusHours(2));
                o2.setOrderStatus("Processing");
                o2.setCreatedAt(LocalDateTime.now().minusHours(2));

                // Order 3: Yesterday, UPI, Paid
                Order o3 = new Order();
                o3.setId("ord_prev_103");
                o3.setUser("demo_user_3");
                o3.setOrderItems(Arrays.asList(
                    new OrderItem("Minimalist Watch", 3, "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80", 1999, "12"),
                    new OrderItem("Urban Slim Fit Shirt", 1, "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&q=80", 1199, "1")
                ));
                o3.setShipping(new Shipping("77 Connaught Place", "New Delhi", "110001", "India"));
                o3.setPayment(new Payment("upi"));
                o3.setItemsPrice(7196);
                o3.setTaxPrice(1295);
                o3.setShippingPrice(0);
                o3.setTotalPrice(8491);
                o3.setPaid(true);
                o3.setPaidAt(LocalDateTime.now().minusDays(1));
                o3.setDelivered(true);
                o3.setDeliveredAt(LocalDateTime.now().minusHours(18));
                o3.setOrderStatus("Delivered");
                o3.setCreatedAt(LocalDateTime.now().minusDays(1));

                // Order 4: 2 Days ago, COD, Processing
                Order o4 = new Order();
                o4.setId("ord_prev_104");
                o4.setUser("demo_user_4");
                o4.setOrderItems(Collections.singletonList(
                    new OrderItem("Denim Trucker Jacket", 1, "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600&q=80", 2799, "14")
                ));
                o4.setShipping(new Shipping("15 Anna Salai", "Chennai", "600002", "India"));
                o4.setPayment(new Payment("cod"));
                o4.setItemsPrice(2799);
                o4.setTaxPrice(504);
                o4.setShippingPrice(0);
                o4.setTotalPrice(3303);
                o4.setPaid(false);
                o4.setOrderStatus("Processing");
                o4.setCreatedAt(LocalDateTime.now().minusDays(2));

                orderRepository.saveAll(Arrays.asList(o1, o2, o3, o4));
                logger.info("Demo orders seeded successfully.");
            }
        } catch (Exception e) {
            logger.warn("Could not seed demo orders: {}", e.getMessage());
        }
    }
}
