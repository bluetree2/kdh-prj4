import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProductRegist } from "./feature/Product/ProductRegist.jsx";
import MainLayout from "./feature/common/MainLayout.jsx";
import { ProductList } from "./feature/Product/ProductList.jsx";
import { ProductDetail } from "./feature/Product/ProductDetail.jsx";
import { ProductEdit } from "./feature/Product/ProductEdit.jsx";
import { Chat } from "./chat/Chat.jsx";

function App() {
  const username = prompt("닉네임을 입력해 주세요");
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path="product/regist" element={<ProductRegist />} />
          <Route path="product/list" element={<ProductList />} />
          <Route path="product/view" element={<ProductDetail />} />
          <Route path="product/edit" element={<ProductEdit />} />
          <Route path="chat/chatting" element={<Chat username={username} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App
