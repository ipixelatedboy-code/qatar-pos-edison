import React from "react";

export default function ProductGrid({ items, onAdd }) {
  const CURRENCY = "QR";
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 16,
        fontFamily: "sans-serif",
      }}
    >
      {items.map((item) => (
        <button
          key={String(item.id)}
          onClick={() => onAdd(item)}
          style={styles.card}
        >
          <div style={styles.name} title={item.name}>
            {item.name}
          </div>
          <div style={styles.price}>
            {CURRENCY}
            {Number(item.price).toFixed(2)}
          </div>
        </button>
      ))}
    </div>
  );
}

const styles = {
  card: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    minHeight: 120,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    borderStyle: "solid",
    cursor: "pointer",
  },
  name: { fontSize: 18, fontWeight: 600, color: "#1E293B", textAlign: "left" },
  price: {
    fontSize: 18,
    color: "#10B981",
    fontWeight: "bold",
    marginTop: 8,
    alignSelf: "flex-end",
  },
};
