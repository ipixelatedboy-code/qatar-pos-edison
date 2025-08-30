import React, { useEffect, useState } from "react";
import { useStore } from "../state/Store";
import { useNavigate } from "react-router-dom";

export default function HistoryScreen() {
  const { getHistory, CURRENCY } = useStore();
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getHistory().then(setRows);
  }, [getHistory]);

  return (
    <div style={styles.container}>
      <div style={{ padding: 24 }}>
        <button onClick={() => navigate("/pos")} style={styles.backBtn}>
          ← Back
        </button>
        {rows.map((item) => (
          <div key={String(item.id)} style={styles.card}>
            <div style={styles.header}>
              <div style={styles.date}>
                {new Date(item.ts).toLocaleString()}
              </div>
              <div style={styles.total}>
                {CURRENCY}
                {item.subtotal.toFixed(2)}
              </div>
            </div>
            <div style={styles.details}>
              <div style={styles.detailText}>
                Staff: <span style={styles.valueText}>{item.staff_name}</span>
              </div>
              <div style={styles.detailText}>
                Student:{" "}
                <span style={styles.valueText}>{item.student_name}</span>
              </div>
              <div style={styles.detailText}>
                Method:{" "}
                <span style={styles.valueText}>{item.payment_method}</span>
              </div>
            </div>
            {item.payment_method === "CASH" ? (
              <div style={styles.paymentInfo}>
                <div>
                  Cash Given: {CURRENCY}
                  {item.cash_given.toFixed(2)} | Change: {CURRENCY}
                  {item.change_due.toFixed(2)}
                </div>
              </div>
            ) : (
              <div style={styles.paymentInfo}>
                <div>
                  Deducted: {CURRENCY}
                  {item.amount_deducted.toFixed(2)} | Outstanding: {CURRENCY}
                  {Number(item.outstanding_after || 0).toFixed(2)}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#F0F4F8",
    fontFamily: "sans-serif",
  },
  backBtn: {
    marginBottom: 24,
    background: "#F3F4F6",
    border: "none",
    color: "#3B82F6",
    fontWeight: "bold",
    fontSize: 18,
    cursor: "pointer",
    padding: "8px 20px",
    borderRadius: 12,
    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
    transition: "background 0.2s",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #E2E8F0",
    paddingBottom: 12,
    marginBottom: 12,
  },
  date: { fontWeight: 600, color: "#475569", fontSize: 16 },
  total: { fontWeight: "bold", fontSize: 20, color: "#1E293B" },
  details: { marginBottom: 12 },
  detailText: { fontSize: 16, color: "#64748B", marginBottom: 4 },
  valueText: { fontWeight: 600, color: "#334155" },
  paymentInfo: {
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 8,
    marginTop: 4,
  },
};
