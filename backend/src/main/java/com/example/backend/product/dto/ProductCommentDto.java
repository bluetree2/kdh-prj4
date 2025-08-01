package com.example.backend.product.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class ProductCommentDto {
    private Integer id;
    private String content;
    private String memberLoginId;
    private Integer memberId;
    private LocalDateTime createdAt;
    private Integer productId;
    private Integer rating;


    public ProductCommentDto(Integer id, String content,
                             String memberLoginId,
                             LocalDateTime createdAt,
                             Integer rating, Integer memberId) {
        this.id = id;
        this.content = content;
        this.memberLoginId = memberLoginId;
        this.createdAt = createdAt;
        this.rating = rating;
        this.memberId = memberId;
    }
}
