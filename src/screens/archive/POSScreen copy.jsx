import React, { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../state/Store";
import ProductGrid from "../../components/ProductGrid";
import Cart from "../../components/Cart";
import Toast from "../../components/Toast";

export default function POSScreen() {
  const {
    products,
    categories,
    logout,
    CURRENCY,
    cart,
    cartTotal,
    addItemToCart,
    incrementCartItem,
    decrementCartItem,
    removeCartItem,
    refreshData, // data refresher
    // Expose API_BASE via store so we keep one source of truth
  } = useStore();
  const API_BASE = import.meta.env.VITE_API_BASE || "/api";

  const [selectedCat, setSelectedCat] = useState(null);
  const [scanBuffer, setScanBuffer] = useState("");
  const inputRef = useRef(null);
  const [toast, setToast] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    refreshData?.(); // Load immediately on mount
    const refreshInterval = setInterval(() => refreshData?.(), 30000);
    return () => clearInterval(refreshInterval);
  }, [refreshData]);

  useEffect(() => {
    const focusInputInterval = setInterval(() => {
      if (inputRef.current && document.activeElement !== inputRef.current) {
        inputRef.current.focus();
      }
    }, 1000);
    return () => clearInterval(focusInputInterval);
  }, []);

  const filteredProducts = useMemo(
    () =>
      products
        .filter((p) => (selectedCat ? p.category_id === selectedCat : true))
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name)),
    [products, selectedCat]
  );

  const processScan = async (code) => {
    if (!code) return;
    try {
      const res = await fetch(
        `${API_BASE}/CategoriesApi/product-by-barcode/${code}`
      );
      if (!res.ok) throw new Error("Product not found");
      const product = await res.json();
      addItemToCart(product);
      setToast(`Added: ${product.name}`);
    } catch (err) {
      setToast(`No product found for barcode: ${code}`);
    }
  };

  const handlePayment = (route) => {
    if (cart.length === 0) {
      setToast("Cart is empty.");
      return;
    }
    navigate(route);
  };

  return (
    <div style={styles.container}>
      <input
        ref={inputRef}
        value={scanBuffer}
        onChange={(e) => setScanBuffer(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const code = (e.currentTarget.value || "").trim();
            if (code) processScan(code);
            setScanBuffer("");
          }
        }}
        style={styles.hiddenInput}
        autoFocus
      />

      <div style={styles.header}>
        <div style={styles.tabsScroll}>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCat(c.id)}
              style={{
                ...styles.tab,
                ...(selectedCat === c.id ? styles.tabActive : {}),
              }}
            >
              <span
                style={{
                  ...styles.tabText,
                  ...(selectedCat === c.id ? styles.tabTextActive : {}),
                }}
              >
                {c.name}
              </span>
            </button>
          ))}
        </div>
        <div style={styles.headerActions}>
          <button
            onClick={() => {
              logout();
              navigate("/login", { replace: true });
            }}
            style={{ ...styles.headerBtn, backgroundColor: "#EF4444" }}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.productsPanel}>
          <ProductGrid items={filteredProducts} onAdd={addItemToCart} />
        </div>
        <div style={styles.cartPanel}>
          <div
            style={{
              flex: 1,
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={styles.cartScrollable}>
              <Cart
                items={cart}
                currency={CURRENCY}
                onInc={incrementCartItem}
                onDec={decrementCartItem}
                onRemove={removeCartItem}
              />
            </div>
          </div>
          <div style={styles.cartFooterBar}>
            <div style={styles.summary}>
              <div style={styles.totalText}>Total</div>
              <div style={styles.totalAmount}>
                {CURRENCY}
                {cartTotal.toFixed(2)}
              </div>
            </div>
            <div style={styles.paymentActions}>
              <button
                onClick={() => handlePayment("/cash")}
                style={{ ...styles.payBtn, backgroundColor: "#10B981" }}
              >
                CASH
              </button>
              <button
                onClick={() => handlePayment("/scan-card")}
                style={{ ...styles.payBtn, backgroundColor: "#3B82F6" }}
              >
                CARD
              </button>
            </div>
          </div>
        </div>
      </div>
      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    minHeight: "50vh",
    backgroundColor: "#F0F4F8",
    padding: 16,
    fontFamily: "sans-serif",
  },
  hiddenInput: {
    position: "absolute",
    top: -1000,
    height: 1,
    width: 1,
    opacity: 0,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  tabsScroll: { display: "flex", overflowX: "auto", gap: 10, paddingBottom: 4 },
  tab: {
    padding: "12px 20px",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    marginRight: 10,
    border: "1px solid #E2E8F0",
    cursor: "pointer",
    borderColor: "white", // Correctly remove outline
  },
  tabActive: { backgroundColor: "#3B82F6", borderColor: "#3B82F6" },
  tabText: { color: "#334155", fontWeight: "bold", fontSize: 16 },
  tabTextActive: { color: "#FFFFFF" },
  headerActions: {
    display: "flex",
    flexDirection: "row",
    marginLeft: "auto",
    gap: 10,
  },
  headerBtn: {
    padding: "12px 20px",
    borderRadius: 16,
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
    border: "none",
    cursor: "pointer",
  },
  content: {
    display: "flex",
    flexDirection: "row",
    gap: 16,
    flex: 1,
    minHeight: 0,
  },
  productsPanel: { flex: 6, minWidth: 0 },
  cartPanel: {
    flex: 4,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    position: "relative",
    paddingBottom: 120, // space for the footer bar
    minHeight: 0,
    display: "flex",
    flexDirection: "column",
    height: "600px", // lock the cart panel height (adjust as needed)
    maxHeight: "600vh",
  },
  cartScrollable: {
    flex: 1,
    minHeight: 0,
    overflowY: "auto",
    // Optionally add padding or background if needed
  },
  cartFooterBar: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
    background: "#F8FAFC",
    borderRadius: 16,
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    padding: "16px 24px 16px 24px",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    zIndex: 2,
  },
  summary: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 0,
    borderTop: "none",
    marginTop: 0,
  },
  totalText: { fontSize: 22, fontWeight: 600, color: "#475569" },
  totalAmount: { fontSize: 28, fontWeight: "bold", color: "#1E293B" },
  paymentActions: {
    display: "flex",
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  payBtn: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 18,
    border: "none",
    cursor: "pointer",
    gap: 12,
    marginTop: 8,
  },
  payBtn: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 18,
    border: "none",
  },
};
