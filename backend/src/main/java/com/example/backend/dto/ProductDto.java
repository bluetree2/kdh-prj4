package com.example.backend.dto;

import lombok.Data;

import java.util.List;

@Data
public class ProductDto {
    private Integer id;
    private String productName;
    private Integer price;
    private String category;
    private String info;
    private Integer quantity;

    private List<String> imagePath;


}
