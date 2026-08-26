package com.amazona;

import com.amazona.dto.CreateReviewRequest;
import com.amazona.exception.ResourceNotFoundException;
import com.amazona.model.Product;
import com.amazona.model.Review;
import com.amazona.repository.ProductRepository;
import com.amazona.service.ProductServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductServiceImpl productService;

    private Product testProduct;

    @BeforeEach
    void setUp() {
        testProduct = new Product("1", "Test Shirt", "image.jpg", "Nike", 99.99, "Shirts", 10, "Test Desc", 4.5, 10);
    }

    @Test
    void testGetAllProducts_ReturnsList() {
        when(productRepository.count()).thenReturn(1L);
        when(productRepository.findAll(any(Sort.class))).thenReturn(Collections.singletonList(testProduct));

        List<Product> products = productService.getAllProducts(null, null, null);

        assertNotNull(products);
        assertEquals(1, products.size());
        assertEquals("Test Shirt", products.get(0).getName());
        verify(productRepository, times(1)).findAll(any(Sort.class));
    }

    @Test
    void testSearchProducts_Success() {
        when(productRepository.count()).thenReturn(1L);
        when(productRepository.findByNameContainingIgnoreCase(eq("Shirt"), any(Sort.class))).thenReturn(Collections.singletonList(testProduct));

        List<Product> products = productService.getAllProducts(null, "Shirt", null);

        assertNotNull(products);
        assertEquals(1, products.size());
        assertEquals("Test Shirt", products.get(0).getName());
    }

    @Test
    void testGetProductById_FoundInRepository() {
        when(productRepository.findById("1")).thenReturn(Optional.of(testProduct));

        Product found = productService.getProductById("1");

        assertNotNull(found);
        assertEquals("1", found.getId());
        assertEquals("Test Shirt", found.getName());
    }

    @Test
    void testGetProductById_NotFound_ThrowsException() {
        when(productRepository.findById("999")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> productService.getProductById("999"));
    }

    @Test
    void testCreateProduct_Success() {
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);

        Product created = productService.createProduct(testProduct);

        assertNotNull(created);
        assertEquals("Test Shirt", created.getName());
        verify(productRepository, times(1)).save(testProduct);
    }

    @Test
    void testCreateProductReview_Success() {
        when(productRepository.findById("1")).thenReturn(Optional.of(testProduct));
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);

        CreateReviewRequest request = new CreateReviewRequest("John", 5.0, "Great item!");
        Review review = productService.createProductReview("1", request, "John");

        assertNotNull(review);
        assertEquals(5.0, review.getRating());
        assertEquals("Great item!", review.getComment());
        assertEquals(1, testProduct.getReviews().size());
        verify(productRepository, times(1)).save(testProduct);
    }

    @Test
    void testDeleteProduct_Success() {
        when(productRepository.existsById("1")).thenReturn(true);
        doNothing().when(productRepository).deleteById("1");

        assertDoesNotThrow(() -> productService.deleteProduct("1"));
        verify(productRepository, times(1)).deleteById("1");
    }
}
