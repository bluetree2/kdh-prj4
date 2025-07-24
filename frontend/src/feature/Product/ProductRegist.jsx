import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function ProductRegist() {
  const [previewImages, setPreviewImages] = useState([]); // 미리보기 URL
  const navigate = useNavigate();
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [info, setInfo] = useState("");
  const [images, setImages] = useState([]);

  function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("productName", productName);
    formData.append("price", price);
    formData.append("quantity", quantity);
    formData.append("category", category);
    formData.append("info", info);
    images.forEach((file) => {
      formData.append("images", file);
    });

    axios
      .post("/api/product/regist", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        alert("🎇상품등록이 완료되었습니다.");
        setProductName("");
        setPrice("");
        setQuantity("");
        setCategory("");
        setInfo("");
        setImages([]);
        setPreviewImages([]);
        navigate("/product/list");
      })
      .catch((err) => {
        console.error(err);
        alert("상품등록중 오류가 발생하였습니다❌.");
      });
  }

  function handleRemoveImage(index) {
    setImages((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
    setPreviewImages((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  }

  function handleImageChange(e) {
    const files = Array.from(e.target.files);
    setImages(files); // 이미지 파일 저장

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews); // 미리보기 URL 저장
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <div>
          상품명
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </div>
        <div>
          가격
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div>
          수량
          <input
            type="text"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
        <div>
          카테고리
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <div>
          상품설명
          <textarea
            rows={5}
            value={info}
            onChange={(e) => setInfo(e.target.value)}
          />
        </div>
        <div>
          상품 이미지
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
          {/* 파일 이름 리스트 출력 */}
          {images.length > 0 && (
            <ul style={{ marginTop: "10px", fontSize: "14px" }}>
              {images.map((file, idx) => (
                <li key={idx}>{file.name}</li>
              ))}
            </ul>
          )}
          {previewImages.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                marginTop: "10px",
              }}
            >
              {previewImages.map((url, idx) => (
                <div key={idx} style={{ position: "relative" }}>
                  <img
                    src={url}
                    alt={`미리보기 ${idx + 1}`}
                    style={{
                      width: "150px",
                      height: "100px",
                      objectFit: "cover",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    style={{
                      position: "absolute",
                      top: 5,
                      right: 5,
                      padding: "2px 6px",
                      fontSize: "12px",
                      color: "white",
                      backgroundColor: "#dc3545", // 부트스트랩 danger 색
                      border: "none",
                      borderRadius: "4px", //
                      cursor: "pointer",
                    }}
                  >
                    취소
                  </button>
                </div>
              ))}
            </div>
          )}
          <button>등록</button>
        </div>
      </div>
    </form>
  );
}
