import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useStore } from "../state/Store";

export default function ReceiptScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const { CURRENCY } = useStore();
  const { transaction } = location.state || {};

  if (!transaction) {
    return (
      <div style={styles.page}>
        <div style={styles.receiptContainer}>
          <p>No transaction details found.</p>
          <button
            onClick={() => navigate("/pos", { replace: true })}
            style={styles.newOrderButton}
          >
            Back to POS
          </button>
        </div>
      </div>
    );
  }

  const {
    branchName,
    ts,
    staff_name,
    items,
    subtotal,
    payment_method,
    cash_given,
    change_due,
    student_name,
    new_balance,
  } = transaction;

  const date = new Date(ts);

  return (
    <div style={styles.page}>
      <div style={styles.receiptContainer}>
        <div style={styles.header}>
          <h1 style={styles.schoolName}>
            Edison School ({branchName || "Main"})
          </h1>
          <p style={styles.dateTime}>{date.toLocaleString()}</p>
          <p style={styles.staffName}>By: {staff_name}</p>
        </div>

        <hr style={styles.hr} />

        <div style={styles.itemsList}>
          {items.map((item) => (
            <div key={item.id} style={styles.item}>
              <span style={styles.itemName}>
                {item.qty} x {item.name}
              </span>
              <span style={styles.itemPrice}>
                {CURRENCY}
                {(item.price * item.qty).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <hr style={styles.hr} />

        <div style={styles.totalSection}>
          <div style={styles.total}>
            <span>Total</span>
            <span>
              {CURRENCY}
              {subtotal.toFixed(2)}
            </span>
          </div>
        </div>

        <div style={styles.paymentDetails}>
          <p>
            <strong>Payment Method:</strong> {payment_method}
          </p>
          {payment_method === "CASH" && (
            <>
              <p>
                <strong>Cash Given:</strong> {CURRENCY}
                {cash_given.toFixed(2)}
              </p>
              <p>
                <strong>Change Due:</strong> {CURRENCY}
                {change_due.toFixed(2)}
              </p>
            </>
          )}
          {payment_method === "CARD" && (
            <>
              <p>
                <strong>Student:</strong> {student_name}
              </p>
              <p>
                <strong>New Balance:</strong> {CURRENCY}
                {(new_balance || 0).toFixed(2)}
              </p>
            </>
          )}
        </div>
        <button
          onClick={() => navigate("/pos", { replace: true })}
          style={styles.newOrderButton}
        >
          New Order
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    backgroundColor: "#F0F4F8",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    minHeight: "100vh",
    padding: "20px",
    fontFamily: "sans-serif",
    boxSizing: "border-box",
  },
  receiptContainer: {
    backgroundColor: "#FFFFFF",
    padding: "2rem",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "420px",
    boxSizing: "border-box",
    marginTop: "2rem",
  },
  header: {
    textAlign: "center",
    marginBottom: "1rem",
  },
  schoolName: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    margin: "0",
    color: "#1E293B",
  },
  dateTime: {
    color: "#64748B",
    margin: "0.25rem 0",
    fontSize: "0.9rem",
  },
  staffName: {
    color: "#64748B",
    margin: "0.25rem 0",
    fontSize: "0.9rem",
  },
  hr: {
    border: "none",
    borderTop: "1px dashed #CBD5E1",
    margin: "1.5rem 0",
  },
  itemsList: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    margin: "1rem 0",
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "1rem",
  },
  itemName: {
    color: "#334155",
    marginRight: "1rem",
  },
  itemPrice: {
    color: "#1E293B",
    fontWeight: "500",
  },
  totalSection: {
    marginTop: "1rem",
  },
  total: {
    display: "flex",
    justifyContent: "space-between",
    fontWeight: "bold",
    fontSize: "1.25rem",
    color: "#1E293B",
  },
  paymentDetails: {
    marginTop: "1.5rem",
    paddingTop: "1.5rem",
    borderTop: "1px solid #E2E8F0",
    color: "#475569",
    fontSize: "1rem",
    lineHeight: "1.6",
  },
  newOrderButton: {
    backgroundColor: "#3B82F6",
    color: "white",
    fontWeight: "bold",
    fontSize: "1rem",
    border: "none",
    borderRadius: "12px",
    padding: "1rem",
    width: "100%",
    marginTop: "2rem",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
};
