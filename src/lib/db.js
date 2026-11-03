import fs from "fs";
import path from "path";

// Đường dẫn tới file lưu trữ dữ liệu (sẽ tự sinh ra file users.json ở thư mục gốc dự án)
const filePath = path.join(process.cwd(), "users.json");

// Hàm đọc dữ liệu từ file JSON
function readData() {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([]));
      return [];
    }
    const fileContent = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(fileContent || "[]");
  } catch (error) {
    return [];
  }
}

// Hàm ghi dữ liệu vào file JSON
function writeData(data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Lỗi ghi file:", error);
  }
}

// Tạo object db giả lập giống như mảng để tránh phải sửa code ở API Route
export const usersDatabase = {
  find: (callback) => {
    const users = readData();
    return users.find(callback);
  },
  push: (newUser) => {
    const users = readData();
    users.push(newUser);
    writeData(users);
  }
};
