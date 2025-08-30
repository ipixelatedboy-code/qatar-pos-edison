import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../state/Store";

export default function CashPaymentScreen() {
  const { cart, cartTotal, recordTxn, CURRENCY } = useStore();
  const [cash, setCash] = useState("");
  const navigate = useNavigate();

  const change = useMemo(() => {
    const num = parseFloat(cash);
    if (isNaN(num)) return 0;
    return Math.max(0, num - cartTotal);
  }, [cash, cartTotal]);

  const complete = async () => {
    const cashNum = parseFloat(cash);
    if (isNaN(cashNum) || cashNum < cartTotal) {
      window.alert(
        "Insufficient Cash: Cash received must be equal to or greater than the total."
      );
      return;
    }
    await recordTxn({
      student_id: null,
      items: cart,
      subtotal: cartTotal,
      payment_method: "CASH",
      cash_given: cashNum,
      change_due: change,
      amount_deducted: 0,
      outstanding_after: 0,
    });
    window.alert("Payment Complete: Transaction recorded successfully.");
    navigate("/pos", { replace: true });
  };

  const handleKeypad = (val) => {
    if (val === "del") {
      setCash((prev) => prev.slice(0, -1));
    } else if (val === ".") {
      if (!cash.includes(".")) setCash((prev) => prev + ".");
    } else {
      setCash((prev) => prev + val);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.leftPanel}>
        <button onClick={() => navigate("/pos")} style={styles.backBtn}>
          ← Back
        </button>
        <div style={styles.cashInputContainer}>
          <div style={styles.labelLeft}>Cash Received</div>
          <input
            style={styles.input}
            value={cash ? CURRENCY + cash : ""}
            placeholder={`${CURRENCY}0.00`}
            onFocus={(e) => e.target.blur()}
            readOnly
          />
        </div>
        <div style={styles.keypad}>
          {[
            ["1", "2", "3"],
            ["4", "5", "6"],
            ["7", "8", "9"],
            [".", "0", "del"],
          ].map((row, i) => (
            <div key={i} style={styles.keypadRow}>
              {row.map((key) => (
                <button
                  key={key}
                  style={styles.keypadBtn}
                  onClick={() => handleKeypad(key)}
                >
                  <div style={styles.keypadTxt}>
                    {key === "del" ? "⌫" : key}
                  </div>
                </button>
              ))}
            </div>
          ))}
        </div>
        <button onClick={complete} style={styles.completeBtn}>
          Complete Payment
        </button>
      </div>
      <div style={styles.rightPanel}>
        <div style={styles.totalLabel}>Amount Due</div>
        <div style={styles.totalAmount}>
          {CURRENCY}
          {cartTotal.toFixed(2)}
        </div>
        <div style={styles.label}>Change Due</div>
        <div style={styles.change}>
          {CURRENCY}
          {change.toFixed(2)}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#F0F4F8",
    minHeight: "100vh",
    minWidth: 0,
    fontFamily: "sans-serif",
    boxSizing: "border-box",
  },
  leftPanel: {
    flex: 2,
    minWidth: 0,
    padding: "32px 24px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "stretch",
    boxSizing: "border-box",
  },
  rightPanel: {
    flex: 1,
    minWidth: 0,
    backgroundColor: "#FFFFFF",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    borderLeft: "1px solid #E2E8F0",
    boxSizing: "border-box",
  },
  totalLabel: {
    fontSize: 20,
    color: "#64748B",
    marginBottom: 8,
    textAlign: "center",
  },
  totalAmount: {
    fontSize: 45,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 24,
    textAlign: "center",
  },
  label: {
    fontSize: 18,
    color: "#64748B",
    marginBottom: 8,
    textAlign: "center",
  },
  labelLeft: {
    fontSize: 18,
    color: "#64748B",
    marginBottom: 8,
    textAlign: "left",
    width: "100%",
  },
  cashInputContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    border: "1px solid #E2E8F0",
    alignItems: "stretch",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
  },
  input: {
    fontSize: 32,
    fontWeight: 600,
    color: "#1E293B",
    textAlign: "center",
    padding: "8px 0",
    width: "100%",
    border: "none",
    background: "transparent",
    boxSizing: "border-box",
  },
  change: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#10B981",
    textAlign: "center",
  },
  keypad: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    width: "100%",
    marginBottom: 8,
  },
  keypadRow: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    width: "100%",
  },
  keypadBtn: {
    flex: 1,
    minWidth: 0,
    height: 80,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    border: "none",
    boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
    cursor: "pointer",
  },
  keypadTxt: { fontSize: 22, fontWeight: 600, color: "#1E293B" },
  completeBtn: {
    backgroundColor: "#10B981",
    padding: "16px",
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
    width: "100%",
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 18,
    border: "none",
    cursor: "pointer",
  },
  backBtn: {
    alignSelf: "flex-start",
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
};
