import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useNavigate } from "react-router";

// 유효기간을 넘긴 토큰 삭제
const token = localStorage.getItem("token");
if (token) {
  const decoded = jwtDecode(token);
  const exp = decoded.exp;
  if (exp * 1000 < Date.now()) {
    localStorage.removeItem("token");
  }
}

// axios interceptor
// token 이 있으면 Authorization 헤더에 'Bearer token' 붙이기
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const AuthenticationContext = createContext(null);

export function AuthenticationContextProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = jwtDecode(token);
      axios
        .get("/api/member?id=" + payload.sub)
        .then((res) => {
          setUser({
            id: res.data.id,
            loginId: res.data.loginId,
            name: res.data.name,
            roles: payload.roles,
          });
        })
        .catch((err) => {})
        .finally(() => {});
    }
  }, []);

  // login
  function login(token) {
    localStorage.setItem("token", token);
    const payload = jwtDecode(token);
    axios.get("/api/member?id=" + payload.sub).then((res) => {
      setUser({
        id: res.data.id,
        loginId: res.data.loginId,
        name: res.data.name,
        roles: payload.roles,
      });
    });
  }

  // logout
  function logout() {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/"; // ✅ 안전하게 사용 가능
  }

  // hasAccess
  function hasAccess(loginId) {
    return user && user.loginId === loginId;
  }

  // isAdmin
  function isAdmin() {
    return Array.isArray(user?.roles) && user.roles.includes("admin");
  }

  return (
    <AuthenticationContext
      value={{
        user: user,
        login: login,
        logout: logout,
        hasAccess: hasAccess,
        isAdmin: isAdmin,
      }}
    >
      {children}
    </AuthenticationContext>
  );
}

export { AuthenticationContext };
