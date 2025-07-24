package com.example.backend.service;

import com.example.backend.dto.ProductDto;
import com.example.backend.dto.ProductEditDto;
import com.example.backend.entity.Product;
import com.example.backend.dto.ProductForm;
import com.example.backend.entity.ProductImage;
import com.example.backend.repository.ProductImageRepository;
import com.example.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final S3Uploader s3Uploader;

    public void add(ProductForm productForm) {
        // 상품 저장
        Product product = new Product();
        product.setProductName(productForm.getProductName());
        product.setPrice(productForm.getPrice());
        product.setCategory(productForm.getCategory());
        product.setInfo(productForm.getInfo());
        product.setQuantity(productForm.getQuantity());
        productRepository.save(product);

        // 이미지 저장
        List<ProductImage> imageList = new ArrayList<>();
        for (MultipartFile file : productForm.getImages()) {
            try {

                String s3Url = s3Uploader.upload(file, String.valueOf(product.getId()));
                ProductImage image = new ProductImage();
                image.setOriginalFileName(file.getOriginalFilename());
                image.setStoredPath(s3Url);
                image.setProduct(product);
                imageList.add(image);
            } catch (IOException e) {
                throw new RuntimeException("업로드 실패 : " + e.getMessage(), e);
            }
//            String originalFileName = file.getOriginalFilename();
//            String uuid = UUID.randomUUID().toString();
//            String storedName = uuid + "_" + originalFileName;
//            String uploadDir = "C:/Temp/prj4/productFile";

//            File savedFile = new File(uploadDir, storedName);
//            try {
//                file.transferTo(savedFile);
//            } catch (IOException e) {
//                throw new RuntimeException("파일 저장에 실패했습니다");
//            }
//
//            ProductImage image = new ProductImage();
//            image.setOriginalFileName(originalFileName);
//            image.setStoredPath(uploadDir + "/" + storedName);
//            image.setProduct(product);
//            imageList.add(image);

        }
        // 이미지 DB에 저장
        productImageRepository.saveAll(imageList);
    }

    public Map<String, Object> list(Integer pageNumber) {
        Pageable pageable = PageRequest.of(pageNumber - 1, 15);
        Page<Product> page = productRepository.findAllByOrderByIdDesc(pageable);


        List<ProductDto> content = page.getContent().stream().map(product -> {
            ProductDto dto = new ProductDto();
            dto.setId(product.getId());
            dto.setProductName(product.getProductName());
            dto.setPrice(product.getPrice());
            if (!product.getImages().isEmpty()) {
                dto.setImagePath(List.of(product.getImages().get(0).getStoredPath()));
            }
            return dto;
        }).toList();

        int totalPages = page.getTotalPages();
        int rightPageNumber = ((pageNumber - 1) / 5 + 1) * 5;
        int leftPageNumber = rightPageNumber - 4;
        rightPageNumber = Math.min(rightPageNumber, totalPages);
        leftPageNumber = Math.max(leftPageNumber, 1);

        var pageInfo = Map.of(
                "totalPages", totalPages,
                "currentPageNumber", pageNumber,
                "leftPageNumber", leftPageNumber,
                "rightPageNumber", rightPageNumber
        );

        return Map.of(
                "pageInfo", pageInfo,
                "productList", content
        );
    }

    public ProductDto view(Long id) {
        Product product = productRepository.findById(id).get();
        ProductDto dto = new ProductDto();
        dto.setId(product.getId());
        dto.setProductName(product.getProductName());
        dto.setPrice(product.getPrice());
        dto.setCategory(product.getCategory());
        dto.setInfo(product.getInfo());
        dto.setQuantity(product.getQuantity());

        List<String> imagePaths = product.getImages().stream().map(ProductImage::getStoredPath).toList();

        dto.setImagePath(imagePaths);
        return dto;
    }

    public void delete(Long id) {
        Product product = productRepository.findById(id).get();
        productRepository.delete(product);
    }

    public void edit(Long id, ProductEditDto dto) {
        Product product = productRepository.findById(id).get();
        product.setProductName(dto.getProductName());
        product.setPrice(dto.getPrice());
        product.setCategory(dto.getCategory());
        product.setInfo(dto.getInfo());
        product.setQuantity(dto.getQuantity());
        if (dto.getDeletedImages() != null) {
            for (String path : dto.getDeletedImages()) {
                productImageRepository.deleteByStoredPath(path); // or deleteByPath(path)
                File file = new File("C:/Temp/prj4/productFile", extractFileName(path));
                file.delete();
            }
            productRepository.save(product);
        }
        if (dto.getNewImages() != null) {
            List<ProductImage> imageList = new ArrayList<>();
            for (MultipartFile file : dto.getNewImages()) {
                String originalFileName = file.getOriginalFilename();
                String uuid = UUID.randomUUID().toString();
                String storedName = uuid + "_" + originalFileName;
                String uploadDir = "C:/Temp/prj4/productFile";

                File savedFile = new File(uploadDir, storedName);
                try {
                    file.transferTo(savedFile);
                } catch (IOException e) {
                    throw new RuntimeException("파일 저장 실패");
                }

                ProductImage image = new ProductImage();
                image.setOriginalFileName(originalFileName);
                image.setStoredPath(uploadDir + "/" + storedName);
                image.setProduct(product);
                imageList.add(image);
            }

            productImageRepository.saveAll(imageList);
        }

    }

    private String extractFileName(String path) {
        return path.substring(path.lastIndexOf("/") + 1);
    }
}
