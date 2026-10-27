'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Import an toàn danh sách sản phẩm từ thư viện lib
import { PRODUCTS as initialProducts } from '@/lib/products'; 
import { getCart, saveCart, subscribeToCart } from '@/lib/cart-storage';

export default function Home() {
  const [cartCount, setCartCount] = useState(0);
  const [products, setProducts] = useState([]);

  // Load danh sách sản phẩm an toàn khi chạy trên client
  useEffect(() => {
    try {
      setProducts(Array.isArray(initialProducts) ? initialProducts : []);
    } catch (err) {
      console.error("Lỗi tải danh sách sản phẩm:", err);
      setProducts([]);
    }
  }, []);

  // Lắng nghe và đồng bộ số lượng giỏ hàng chuẩn xác
  useEffect(() => {
    const updateCount = () => {
      try {
        const items = getCart();
        const total = items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
        setCartCount(total);
      } catch (e) {
        setCartCount(0);
      }
    };

    updateCount();
    const unsubscribe = subscribeToCart(updateCount);
    return () => unsubscribe();
  }, []);

  // Xử lý thêm vào giỏ hàng an toàn
  const handleAddToCart = (product) => {
    try {
      const currentCart = getCart();
      
      // Tìm kiếm sản phẩm dựa vào ID (hỗ trợ cả string và number)
      const existingIndex = currentCart.findIndex(
        (item) => String(item.id) === String(product.id)
      );

      if (existingIndex > -1) {
        currentCart[existingIndex].quantity += 1;
      } else {
        currentCart.push({
          id: product.id,
          name: product.name || 'Sản phẩm',
          price: Number(product.price) || 0,
          quantity: 1,
        });
      }

      saveCart(currentCart);
      alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
    } catch (err) {
      console.error("Lỗi khi thêm vào giỏ hàng:", err);
      alert("Không thể thêm sản phẩm vào giỏ hàng lúc này.");
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#333', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* 1. Header */}
      <header style={{ background: '#1a1a1a', color: '#fff', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <div className="logo">
          <Link href="/" style={{ color: '#fff', textDecoration: 'none' }}>
            <h1 style={{ margin: 0, fontSize: '24px' }}>Shop Áo</h1>
          </Link>
        </div>

        <nav style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', gap: '15px' }}>
            <li><Link href="/" style={{ color: '#fff', textDecoration: 'none' }}>Trang chủ</Link></li>
            <li><Link href="/products" style={{ color: '#fff', textDecoration: 'none' }}>Sản phẩm</Link></li>
            <li><Link href="/about-us" style={{ color: '#fff', textDecoration: 'none' }}>Giới thiệu</Link></li>
            <li><Link href="/contact" style={{ color: '#fff', textDecoration: 'none' }}>Liên hệ</Link></li>
          </ul>

          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', gap: '15px', borderLeft: '1px solid #555', paddingLeft: '15px' }}>
            <li><Link href="/login" style={{ color: '#ddd', textDecoration: 'none' }}>Đăng nhập</Link></li>
            <li><Link href="/register" style={{ color: '#ddd', textDecoration: 'none' }}>Đăng ký</Link></li>
          </ul>
        </nav>

        <div className="cart-icon" style={{ background: '#e67e22', padding: '8px 15px', borderRadius: '20px' }}>
          <Link href="/cart" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>
            Giỏ hàng: <strong style={{ color: '#fff' }}>{cartCount}</strong> sản phẩm
          </Link>
        </div>
      </header>

      {/* 2. Banner */}
      <section style={{ background: '#f4f4f9', padding: '40px 20px', textAlign: 'center', borderBottom: '1px solid #eee' }}>
        <h2 style={{ fontSize: '30px', marginBottom: '10px' }}>Bộ Sưu Tập Thời Trang 2026</h2>
        <p style={{ color: '#666', maxWidth: '600px', margin: '0 auto' }}>
          Khám phá những mẫu áo hợp mốt, chất liệu cao cấp và phong cách độc đáo dành riêng cho bạn.
        </p>
      </section>

      {/* 3. Main Content */}
      <main style={{ flex: 1, maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', width: '100%', boxSizing: 'border-box' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#222' }}>Sản Phẩm Mới Nhất</h2>

        {products.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>Đang cập nhật sản phẩm...</p>
        ) : (
          <div className="product-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '25px' }}>
            {products.map((product) => (
              <div
                key={product.id}
                className="product-card"
                style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  padding: '15px',
                  textAlign: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  background: '#fff'
                }}
              >
                <div>
                  <img
                    src={product.image || 'https://via.placeholder.com/400'}
                    alt={product.name || 'Sản phẩm'}
                    style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '6px', marginBottom: '15px' }}
                  />
                  <h3 style={{ fontSize: '18px', margin: '10px 0' }}>{product.name}</h3>
                  <p style={{ color: '#e74c3c', fontWeight: 'bold', fontSize: '16px', margin: '5px 0 15px 0' }}>
                    {Number(product.price || 0).toLocaleString('vi-VN')} VND
                  </p>
                </div>
                <button
                  onClick={() => handleAddToCart(product)}
                  style={{
                    background: '#27ae60',
                    color: '#fff',
                    border: 'none',
                    padding: '10px 15px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  Thêm vào giỏ
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 4. Footer */}
      <footer style={{ background: '#1a1a1a', color: '#aaa', padding: '30px 20px', textAlign: 'center', borderTop: '4px solid #e67e22', marginTop: 'auto' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h3 style={{ color: '#fff', margin: '0 0 10px 0' }}>SHOP ÁO THỜI TRANG</h3>
          <p style={{ margin: '5px 0' }}>Địa chỉ: 97 đường Man Thiện, Quận 9, TP. Hồ Chí Minh</p>
          <p style={{ margin: '5px 0' }}>Hotline: 0368 758 333 | Email: hotro@shopao.com</p>
          <div style={{ margin: '15px 0', borderTop: '1px solid #333', paddingTop: '15px' }}>
            <p style={{ margin: 0, fontSize: '14px' }}>&copy; 2026 Shop Áo. Tất cả quyền được bảo lưu.</p>
          </div>  
        </div>
      </footer>

    </div>
  );
}