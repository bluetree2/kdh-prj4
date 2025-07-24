import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swipe from "bootstrap/js/src/util/swipe.js";
import { Button } from "react-bootstrap";

export function ProductEdit() {
  const [newImages, setNewImages] = useState([]); // 새로 추가된 파일들
  const [previewImages, setPreviewImages] = useState([]); // 미리보기용 URL
  const [deletedImagePaths, setDeletedImagePaths] = useState([]);

  const [imagePaths, setImagePaths] = useState([]); // 전체 이미지 경로 리스트
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [form, setForm] = useState({
    productName: "",
    price: "",
    category: "",
    info: "",
    quantity: "",
  });
  const [thumbnail, setThumbnail] = useState("");

  useEffect(() => {
    axios
      .get(`/api/product/view?id=${id}`)
      .then((res) => {
        setForm({
          productName: res.data.productName,
          price: res.data.price,
          category: res.data.category,
          info: res.data.info,
          quantity: res.data.quantity,
        });
        setImagePaths(res.data.imagePath || []); // 전체 이미지 리스트 저장
        setThumbnail(res.data.imagePath?.[0]); // 대표 이미지 하나는 그대로 사용 가능
      })
      .catch((err) => {})
      .finally(() => {});
  }, [id]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSave() {
    const formData = new FormData();
    formData.append("productName", form.productName);
    formData.append("price", form.price);
    formData.append("category", form.category);
    formData.append("info", form.info);
    formData.append("quantity", form.quantity);
    formData.append("id", id); // 수정 대상 id

    // 삭제 이미지
    deletedImagePaths.forEach((path) => {
      formData.append("deletedImages", path);
    });

    // 추가 이미지
    newImages.forEach((file) => {
      formData.append("newImages", file);
    });

    axios
      .put(`/api/product/edit`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        alert("수정 완료");
        navigate(`/product/view?id=${id}`);
      })
      .catch((err) => {
        console.error("수정 실패", err);
      });
  }

  function handleRemoveNewImage(index) {
    // 1. 미리보기 제거
    setPreviewImages((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });

    // 2. 실제 업로드 대상 파일도 제거
    setNewImages((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  }

  function handleAddImages(e) {
    const files = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...files]);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...newPreviews]);
  }

  function handleImageDelete(index) {
    const deleted = imagePaths[index]; // 삭제 대상 경로 추출
    setDeletedImagePaths((prev) => [...prev, deleted]); // 삭제 리스트에 추가

    const updated = [...imagePaths];
    updated.splice(index, 1); // 화면에서 제거
    setImagePaths(updated);
  }

  return (
    <>
      <div>
        <h2>상품 정보수정</h2>
        <div>
          <h4>등록된 이미지</h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {imagePaths.map((path, idx) => {
              const fileName = path.split("/").pop();
              return (
                <div key={idx} style={{ position: "relative" }}>
                  <img
                    src={`http://localhost:8080/static/${fileName}`}
                    alt={`상품 이미지 ${idx + 1}`}
                    width="150"
                    height="100"
                    style={{ border: "1px solid #ccc", borderRadius: "4px" }}
                  />
                  <Button
                    variant="danger"
                    size="sm"
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
                    onClick={() => handleImageDelete(idx)}
                  >
                    삭제
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <h4>새 이미지 추가</h4>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleAddImages}
          />
          {newImages.length > 0 && (
            <ul style={{ marginTop: "10px" }}>
              {newImages.map((file, idx) => (
                <li key={idx} style={{ fontSize: "14px" }}>
                  {file.name}
                </li>
              ))}
            </ul>
          )}
        </div>

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
                alt={`추가 이미지 ${idx + 1}`}
                width="150"
                height="100"
                style={{ border: "1px solid #aaa", borderRadius: "4px" }}
              />
              {/*  미리보기 취소버튼*/}
              <Button
                variant="light"
                size="sm"
                onClick={() => handleRemoveNewImage(idx)}
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
              </Button>
            </div>
          ))}
        </div>
        <div>
          상품명
          <input
            name="productName"
            onChange={handleChange}
            value={form.productName}
            type="text"
          />
        </div>
        <div>
          가격
          <input
            name="price"
            onChange={handleChange}
            value={form.price}
            type="text"
          />
        </div>
        <div>
          카테고리
          <input
            name="category"
            onChange={handleChange}
            value={form.category}
            type="text"
          />
        </div>
        <div>
          수량
          <input
            name="quantity"
            onChange={handleChange}
            value={form.quantity}
            type="text"
          />
        </div>
        <div>
          상품설명
          <textarea
            value={form.info}
            onChange={handleChange}
            name="info"
          ></textarea>
        </div>
        <div>
          <button onClick={handleSave}>저장</button>
          <button onClick={() => navigate(-1)}>취소</button>
        </div>
      </div>
    </>
  );
}
