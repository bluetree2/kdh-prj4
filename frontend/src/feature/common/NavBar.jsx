import React from "react";
import { Link } from "react-router-dom";

function NavBar(props) {
  return (
    <nav>
      <Link to="/">메인</Link>
      <Link to="/product/list">상품목록</Link>
      <Link to="/product/regist">상품등록</Link>
    </nav>
  );
}

export default NavBar;
