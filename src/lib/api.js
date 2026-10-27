import axios from 'axios';

const api = axios.create({
  // Thay đổi port (ví dụ: 5000 hoặc 5001) theo cổng mà .NET Core Backend của bạn đang chạy
  baseURL: 'https://localhost:5001/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;