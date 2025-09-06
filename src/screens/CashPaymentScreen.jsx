import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../state/Store";

export default function CashPaymentScreen() {
  const { cart, cartTotal, recordTxn, CURRENCY } = useStore();
  const [cash, setCash] = useState("");
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_BASE || "/api";

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

    try {
      // Create a detailed note from cart items
      const noteDetails = cart
        .map(
          (item) =>
            `${item.name} x${item.qty} @ ${CURRENCY}${item.price.toFixed(2)}`
        )
        .join("\n");

      // POST the transaction to the API for the hardcoded "cashcashcash" user
      const apiRes = await fetch(
        `${API_BASE}/CategoriesApi/student-transactions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            barcodeValue: "cashcashcash", // ✅ Hardcoded ID for cash sales
            amount: cartTotal,
            note: `Cash Purchase:\n${noteDetails}`,
            lines: cart.map((item) => ({
              productId: item.id,
              quantity: item.qty,
              price: item.price,
            })),
          }),
        }
      );

      if (!apiRes.ok) {
        // If the API call fails, stop the process and show an error
        throw new Error("Failed to record cash transaction on the server.");
      }

      // Record the transaction locally and proceed to receipt
      const newTxn = await recordTxn({
        student_id: "cashcashcash",
        student_name: "Cash Sale",
        items: cart,
        subtotal: cartTotal,
        payment_method: "CASH",
        cash_given: cashNum,
        change_due: change,
        amount_deducted: cartTotal, // Amount deducted from the "cashcashcash" account
        outstanding_after: 0,
      });

      // Navigate to the receipt screen
      navigate("/receipt", { state: { transaction: newTxn } });
    } catch (error) {
      console.error("Error completing cash payment:", error);
      window.alert("Payment Failed: " + error.message);
    }
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
          {CURRENCY} {cartTotal.toFixed(2)}
        </div>

        <div style={styles.label}>Change Due</div>
        <div style={styles.change}>
          {CURRENCY} {change.toFixed(2)}
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
  },
  rightPanel: {
    flex: 1,
    minWidth: 0,
    backgroundColor: "#FFFFFF",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    borderLeft: "1px solid #E2E8F0",
    boxSizing: "border-box",
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
  cashInputContainer: {
    position: "relative",
    width: "100%",
    marginBottom: 24,
  },
  labelLeft: {
    position: "absolute",
    left: 18,
    top: -12,
    backgroundColor: "#F0F4F8",
    padding: "0 4px",
    fontSize: 16,
    color: "#64748B",
  },
  input: {
    width: "90%",
    border: "1px solid #CBD5E1",
    borderRadius: 12,
    padding: "16px 18px",
    fontSize: 24,
    backgroundColor: "#FFFFFF",
    color: "#1E293B",
  },
  totalLabel: { fontSize: 24, color: "#64748B", marginBottom: 8 },
  totalAmount: {
    fontSize: 45,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 32,
  },
  label: {
    fontSize: 18,
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
    padding: "16px 0",
    borderRadius: 16,
    width: "100%",
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 22,
    border: "none",
    cursor: "pointer",
  },
};
