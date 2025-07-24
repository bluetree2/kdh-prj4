package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "product")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String productName;
    private Integer price;
    private String category;
    private String info;
    private Integer quantity;

    @Column(insertable = false, updatable = false)
    private LocalDateTime insertedAt;


    @OneToMany(mappedBy = "product", orphanRemoval = true)
    private List<ProductImage> images = new ArrayList<>();

}
