import React from "react";

export default function Cart({ items, currency, onInc, onDec, onRemove }) {
  return (
    <div style={styles.container}>
      <div style={styles.title}>Current Order</div>
      {items.length === 0 ? (
        <div style={styles.emptyContainer}>
          <div style={styles.emptyText}>The cart is empty.</div>
        </div>
      ) : (
        <div style={styles.itemsList}>
          {items.map((item) => (
            <div key={String(item.id)} style={styles.itemCard}>
              <div style={styles.itemInfo}>
                <div style={styles.itemName} title={item.name}>
                  {item.name}
                </div>
                <div style={styles.itemPrice}>
                  {currency}
                  {(item.price ?? 0).toFixed(2)}
                </div>
              </div>
              <div style={styles.controls}>
                <button
                  onClick={() => {
                    if (item.qty > 1) onDec(item);
                  }}
                  style={{
                    ...styles.qBtn,
                    ...(item.qty === 1
                      ? { opacity: 0.5, cursor: "not-allowed" }
                      : {}),
                  }}
                  disabled={item.qty === 1}
                >
                  -
                </button>
                <div style={styles.qtyNum}>{item.qty}</div>
                <button onClick={() => onInc(item)} style={styles.qBtn}>
                  +
                </button>
                <button onClick={() => onRemove(item)} style={styles.removeBtn}>
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    flex: 1,
    gap: 16,
    display: "flex",
    flexDirection: "column",
    fontFamily: "sans-serif",
    minHeight: 0,
    height: "100%",
  },
  title: { fontWeight: "bold", fontSize: 24, color: "#1E293B", flexShrink: 0 },
  itemsList: {
    flex: 1,
    minHeight: 0,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    paddingBottom: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    display: "flex",
  },
  emptyText: { fontSize: 18, color: "#64748B" },
  itemCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderStyle: "solid",
  },
  itemInfo: { flex: 1, marginRight: 12 },
  itemName: {
    fontWeight: 600,
    color: "#334155",
    fontSize: 16,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  itemPrice: {
    color: "#3B82F6",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 4,
  },
  controls: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  qtyNum: {
    minWidth: 30,
    textAlign: "center",
    fontWeight: "bold",
    color: "#1E293B",
    fontSize: 18,
  },
  qBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E0E7FF",
    borderRadius: 10,
    border: "none",
    display: "flex",
    fontWeight: 700,
    fontSize: 22,
    cursor: "pointer",
  },
  removeBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEE2E2",
    borderRadius: 10,
    marginLeft: 8,
    border: "none",
    fontWeight: 700,
    fontSize: 18,
    color: "#EF4444",
    cursor: "pointer",
    display: "flex",
  },
};
