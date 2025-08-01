package com.example.backend.qna.entity;

import com.example.backend.product.entity.Product;
import com.example.backend.member.entity.Member;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;
import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@Entity
@Table(name = "question", schema = "prj4")
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @ManyToOne(optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false, referencedColumnName = "login_id")
    private Member user;

    @Column(name = "title", nullable = false, length = 50)
    private String title;

    @Column(name = "content", nullable = false)
    private String content;

    @ColumnDefault("'open'")
    @Column(name = "status")
    private String status;

    @ColumnDefault("current_timestamp()")
    @Column(insertable = false, name = "created_at")
    private LocalDateTime createdAt;

    @ColumnDefault("current_timestamp()")
    @Column(insertable = false, name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "category", nullable = false)
    private int category;

}