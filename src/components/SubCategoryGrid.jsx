import React from "react";

export default function SubCategoryGrid({ subCategories, onSelect }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 16,
        fontFamily: "sans-serif",
      }}
    >
      {subCategories.map((subCategory) => (
        <button
          key={subCategory}
          onClick={() => onSelect(subCategory)}
          style={styles.card}
        >
          <div style={styles.name}>{subCategory}</div>
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
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    borderStyle: "solid",
    cursor: "pointer",
    textAlign: "center",
  },
  name: { fontSize: 20, fontWeight: 600, color: "#1E293B" },
};
