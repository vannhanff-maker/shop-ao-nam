"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Thêm useRouter để chuyển hướng
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    // 1. Validate dữ liệu nhanh ở Client
    if (form.password.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Mật khẩu nhập lại không khớp.");
      return;
    }

    try {
      // 2. Gọi API Route xử lý đăng ký thông tin vào DB
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          username: form.username, // Gửi kèm username nếu DB cần lưu thêm
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Đăng ký thất bại.");
      } else {
        setError("");
        setSuccess("Đăng ký thành công! Đang chuyển hướng sang đăng nhập...");
        
        // Tự động chuyển sang trang đăng nhập sau 1.5 giây
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      }
    } catch (err) {
      setError("Không thể kết nối đến server.");
    }
  }

  return (
    <main className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>ĐĂNG KÝ</h2>

        <p className="register-description">
          Tạo tài khoản để khám phá thời trang nam.
        </p>

        <input
          type="text"
          id="username"
          name="username"
          placeholder="Tên đăng nhập"
          value={form.username}
          onChange={handleChange}
          autoComplete="username"
          required
          minLength={3}
        />

        <input
          type="email"
          id="email"
          name="email"
          placeholder="Nhập email"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
          required
        />

        <input
          type="password"
          id="password"
          name="password"
          placeholder="Nhập mật khẩu (ít nhất 8 ký tự)"
          value={form.password}
          onChange={handleChange}
          autoComplete="new-password"
          required
          minLength={8}
        />

        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          placeholder="Nhập lại mật khẩu"
          value={form.confirmPassword}
          onChange={handleChange}
          autoComplete="new-password"
          required
          minLength={8}
        />

        {error && (
          <p className="register-error" role="alert">
            {error}
          </p>
        )}

        {success && (
          <p className="register-success" role="status">
            {success}
          </p>
        )}

        <div className="form-links">
          <span>Đã có tài khoản?</span>
          <Link href="/login">Đăng nhập</Link>
        </div>

        <button type="submit">TẠO TÀI KHOẢN</button>
      </form>
    </main>
  );
}
