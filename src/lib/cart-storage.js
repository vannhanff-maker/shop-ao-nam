const CART_KEY = "shop-ao-nam-cart";
const SERVER_CART = "[]";

export function getCartSnapshot() {
  if (typeof window === "undefined") return SERVER_CART;
  return window.localStorage.getItem(CART_KEY) || SERVER_CART;
}

export function getServerCartSnapshot() {
  return SERVER_CART;
}

export function subscribeToCart(callback) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("shop-cart-updated", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("shop-cart-updated", callback);
    window.removeEventListener("storage", callback);
  };
}

export function getCart() {
  const value = getCartSnapshot();
  let items;

  try {
    items = JSON.parse(value);
  } catch (e) {
    return []; // Trả về mảng rỗng nếu dữ liệu localStorage bị lỗi phân tích
  }

  // Kiểm tra tính hợp lệ linh hoạt hơn (cho phép id là chuỗi hoặc số)
  if (
    !Array.isArray(items) ||
    items.some(
      (item) =>
        !item ||
        (typeof item.id !== "string" && typeof item.id !== "number") ||
        typeof item.name !== "string" ||
        item.quantity === undefined ||
        Number(item.quantity) < 1,
    )
  ) {
    // Thay vì throw error làm sập ứng dụng, ta trả về mảng rỗng hoặc reset lại
    return [];
  }

  return items;
}

export function saveCart(items) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("shop-cart-updated"));
}
