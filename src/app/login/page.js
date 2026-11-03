"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; // Import Context quản lý session
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { loginState } = useAuth(); // Lấy hàm lưu trạng thái đăng nhập
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      // Gọi API đối chiếu thông tin với DB
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Đăng nhập không thành công.");
      } else {
        // Lưu thông tin đăng nhập thành công vào Context & LocalStorage
        loginState(data.user);

        // Chuyển hướng người dùng về trang chủ Dashboard
        router.push("/");
      }
    } catch (err) {
      setError("Không thể kết nối đến server.");
    }
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>ĐĂNG NHẬP</h2>

        {error && (
          <p
            className="login-error"
            style={{ color: "red", marginBottom: "15px", fontSize: "14px" }}
            role="alert"
          >
            {error}
          </p>
        )}

        <input
          type="email" // Đổi thành type="email" để khớp với thông tin lưu ở API Route
          id="email"
          name="email"
          placeholder="Email đăng nhập"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          id="password"
          name="password"
          placeholder="Mật khẩu"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="form-links">
          <Link href="/forgot-password">Quên mật khẩu?</Link>

          <Link href="/register">Đăng ký</Link>
        </div>

        <button type="submit" className="login-button">
          ĐĂNG NHẬP
        </button>

        <div className="form-login-links">
          <button
            type="button"
            className="google-button"
            onClick={() => alert("Đăng nhập Google chưa được tích hợp")}
          >
            Đăng nhập với Google
          </button>

          <button
            type="button"
            className="facebook-button"
            onClick={() => alert("Đăng nhập Facebook chưa được tích hợp")}
          >
            Đăng nhập với Facebook
          </button>
        </div>

        <p className="register-prompt">
          Chưa có tài khoản? <Link href="/register">Đăng ký ngay</Link>
        </p>
      </form>
    </div>
  );
}
