import { NextResponse } from "next/server";
import { usersDatabase } from "@/lib/db";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // 1. Kiểm tra dữ liệu hợp lệ (Validate)
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { message: "Email không hợp lệ!" },
        { status: 400 },
      );
    }
    if (!password || password.length < 6) {
      return NextResponse.json(
        { message: "Mật khẩu phải từ 6 ký tự trở lên!" },
        { status: 400 },
      );
    }

    // 2. Query kiểm tra xem Email đã tồn tại trong hệ thống chưa
    const userExists = usersDatabase.find((user) => user.email === email);
    if (userExists) {
      return NextResponse.json(
        { message: "Email này đã được đăng ký!" },
        { status: 400 },
      );
    }

    // 3. Thêm user mới vào Database giả lập
    const newUser = {
      id: Math.random().toString(36).substring(2, 9), // Tạo ID ngẫu nhiên
      email,
      password, // Trong thực tế nên mã hóa mật khẩu trước khi lưu
    };
    usersDatabase.push(newUser);

    return NextResponse.json(
      { message: "Đăng ký thành công!" },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi Server hệ thống" },
      { status: 500 },
    );
  }
}
