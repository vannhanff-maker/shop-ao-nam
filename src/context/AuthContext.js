"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Đọc dữ liệu từ local storage ngay khi tải trang
  useEffect(() => {
    const storedUser = localStorage.getItem("user_session");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem("user_session");
      }
    }
    setLoading(false);
  }, []);

  // Hàm xử lý lưu session khi đăng nhập thành công
  const loginState = (userData) => {
    setUser(userData);
    localStorage.setItem("user_session", JSON.stringify(userData));
  };

  // Hàm đăng xuất tài khoản
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user_session");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginState, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth phải nằm trong AuthProvider");
  return context;
}
