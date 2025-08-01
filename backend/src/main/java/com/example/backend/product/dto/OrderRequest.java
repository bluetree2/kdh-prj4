package com.example.backend.product.dto;

import lombok.Data;

@Data
public class OrderRequest {
    private Integer productId;
    private Integer optionId;
    private Integer quantity;
    private Integer price;
    private String shippingAddress;
    private String memo;
    private String productName;
    private String optionName;
    private String zipcode;
    private String addressDetail;
    private String orderToken;


}
