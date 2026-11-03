import { NextResponse } from "next/server";
import { usersDatabase } from "@/lib/db";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Vui lòng nhập đầy đủ thông tin!" }, { status: 400 });
    }

    // Query DB tìm user theo email trùng khớp
    const user = usersDatabase.find((u) => u.email === email);

    // Kiểm tra tài khoản và mật khẩu
    if (!user || user.password !== password) {
      return NextResponse.json({ message: "Email hoặc mật khẩu không chính xác!" }, { status: 401 });
    }

    // Trả về thông tin an toàn (ẩn mật khẩu)
    return NextResponse.json({
      message: "Đăng nhập thành công!",
      user: { id: user.id, email: user.email }
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Lỗi Server hệ thống" }, { status: 500 });
  }
}
