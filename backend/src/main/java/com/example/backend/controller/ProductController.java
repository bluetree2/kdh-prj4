package com.example.backend.controller;

import com.example.backend.dto.ProductDto;
import com.example.backend.dto.ProductEditDto;
import com.example.backend.dto.ProductForm;
import com.example.backend.repository.ProductRepository;
import com.example.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/product")
public class ProductController {

    private final ProductService productService;
    private final ProductRepository productRepository;

    @PutMapping(value = "/edit", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public void editProduct(@RequestParam Long id,
                            @RequestParam String productName,
                            @RequestParam Integer price,
                            @RequestParam String category,
                            @RequestParam String info,
                            @RequestParam Integer quantity,
                            @RequestParam(required = false) List<String> deletedImages,
                            @RequestPart(required = false) List<MultipartFile> newImages
    ) {
        ProductEditDto dto = new ProductEditDto();
        dto.setProductName(productName);
        dto.setPrice(price);
        dto.setCategory(category);
        dto.setInfo(info);
        dto.setQuantity(quantity);
        dto.setDeletedImages(deletedImages);
        dto.setNewImages(newImages);

        productService.edit(id, dto);
    }

    @DeleteMapping("/delete")
    public void delete(@RequestParam Long id) {
        productService.delete(id);
    }

    @GetMapping("/view")
    public ProductDto view(@RequestParam(defaultValue = "") Long id) {

        return productService.view(id);
    }

    @GetMapping("/list")
    public ResponseEntity<?> list(@RequestParam(defaultValue = "1") Integer page) {
        return ResponseEntity.ok(productService.list(page));
    }

    @PostMapping("/regist")
    public ResponseEntity<?> regist(@ModelAttribute ProductForm productForm) {
//        System.out.println("productForm = " + productForm);
        productService.add(productForm);
        return ResponseEntity.ok().build();
    }

}
