package com.example.backend.product.dto;

import com.example.backend.product.entity.Product;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "product_image")
public class ProductImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String storedPath;
    private String originalFileName;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;
}
