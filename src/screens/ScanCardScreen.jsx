// ScanCardScreen.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../state/Store";

const VirtualKeyboard = ({ onKeyPress }) => {
  const keys = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M", "DEL"],
  ];
  return (
    <div style={styles.keypad}>
      {keys.map((row, i) => (
        <div key={i} style={styles.keypadRow}>
          {row.map((key) => (
            <button
              key={key}
              style={styles.keypadBtn}
              onClick={() => onKeyPress(key)}
            >
              <div style={styles.keypadTxt}>{key === "DEL" ? "⌫" : key}</div>
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default function ScanCardScreen() {
  const { cartTotal, recordTxn, CURRENCY, cart } = useStore();
  const [cardId, setCardId] = useState("");
  const [student, setStudent] = useState(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_BASE || "/api";

  // ✅ fixed: use working endpoint to fetch student balance
  const lookup = async (id) => {
    if (!id) return;
    try {
      const res = await fetch(
        `https://edison-qr.eagletechsolutions.co.uk/api/CategoriesApi/student-balance/${id}`
      );
      if (!res.ok) {
        setStudent(null);
        window.alert("Not Found: No student associated with that Card ID.");
        return;
      }
      const balance = await res.json();
      setStudent({
        id,
        card_id: id,
        name: `Student ${id}`,
        balance: parseFloat(balance),
        outstanding: 0,
      });
    } catch (err) {
      console.error("Lookup error:", err);
      setStudent(null);
      window.alert("Error looking up student.");
    }
  };

  const handleKeyPress = (key) => {
    if (key === "DEL") {
      setCardId((prev) => prev.slice(0, -1));
    } else {
      setCardId((prev) => prev + key);
    }
  };

  // const charge = async () => {
  //   if (!student) return;
  //   const { id, name } = student;

  //   try {
  //     const res = await fetch(
  //       `${API_BASE}/CategoriesApi/student-transactions`,
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({
  //           barcodeValue: id,
  //           amount: cartTotal,
  //           note: "POS purchase",
  //         }),
  //       }
  //     );

  //     if (!res.ok) {
  //       throw new Error("Failed to charge student card.");
  //     }

  //     const newTxn = await recordTxn({
  //       student_id: id,
  //       student_name: name,
  //       items: cart,
  //       subtotal: cartTotal,
  //       payment_method: "CARD",
  //       cash_given: 0,
  //       change_due: 0,
  //       amount_deducted: cartTotal,
  //       outstanding_after: 0,
  //     });

  //     // ✅ Always go to receipt like cash
  //     navigate("/receipt", { state: { transaction: newTxn } });
  //   } catch (error) {
  //     console.error("Error during card charge:", error);
  //     window.alert("Charge Failed: " + error.message);
  //   }
  // };
  // const charge = async () => {
  //   if (!student) return;
  //   const { id, name } = student;

  //   try {
  //     const res = await fetch(
  //       `${API_BASE}/CategoriesApi/student-transactions`,
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({
  //           barcodeValue: id,
  //           amount: cartTotal,
  //           note: "Canteen snacks", // updated note // not not takinig ni the items from cart
  //           lines: cart.map((item) => ({
  //             productId: item.id,
  //             quantity: item.qty,
  //           })),
  //         }),
  //       }
  //     );

  //     if (!res.ok) {
  //       throw new Error("Failed to charge student card.");
  //     }

  //     const newTxn = await recordTxn({
  //       student_id: id,
  //       student_name: name,
  //       items: cart,
  //       subtotal: cartTotal,
  //       payment_method: "CARD",
  //       cash_given: 0,
  //       change_due: 0,
  //       amount_deducted: cartTotal,
  //       outstanding_after: 0,
  //     });

  //     // ✅ Always go to receipt like cash
  //     navigate("/receipt", { state: { transaction: newTxn } });
  //   } catch (error) {
  //     console.error("Error during card charge:", error);
  //     window.alert("Charge Failed: " + error.message);
  //   }
  // };

  const charge = async () => {
    if (!student) return;
    const { id, name } = student;

    try {
      const noteDetails = cart
        .map(
          (item) =>
            `${item.name} x${item.qty} @ ${CURRENCY}${item.price.toFixed(2)}`
        )
        .join("\n"); // ✅ line breaks for readability

      const res = await fetch(
        `${API_BASE}/CategoriesApi/student-transactions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            barcodeValue: id,
            amount: cartTotal,
            note: `Canteen snacks:\n${noteDetails}`, // ✅ neat multi-line note
            lines: cart.map((item) => ({
              productId: item.id,
              quantity: item.qty,
              price: item.price,
            })),
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to charge student card.");
      }

      const newTxn = await recordTxn({
        student_id: id,
        student_name: name,
        items: cart,
        subtotal: cartTotal,
        payment_method: "CARD",
        cash_given: 0,
        change_due: 0,
        amount_deducted: cartTotal,
        outstanding_after: 0,
      });

      navigate("/receipt", { state: { transaction: newTxn } });
    } catch (error) {
      console.error("Error during card charge:", error);
      window.alert("Charge Failed: " + error.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={{ flexGrow: 1, display: "flex" }}>
        <div style={styles.leftPanel}>
          <button onClick={() => navigate("/pos")} style={styles.backBtn}>
            ← Back
          </button>
          <div style={styles.title}>Scan or Enter Student Card</div>
          <div style={styles.inputContainer}>
            <input
              placeholder="Card ID (e.g., S100)"
              value={cardId}
              onChange={(e) => setCardId(e.target.value)}
              style={styles.input}
              onKeyDown={(e) => {
                if (e.key === "Enter") lookup(cardId);
              }}
            />
            <button
              onClick={() => setIsKeyboardVisible(!isKeyboardVisible)}
              style={styles.toggleBtn}
            >
              {isKeyboardVisible ? "Hide" : "Show"} Keyboard
            </button>
            <button onClick={() => lookup(cardId)} style={styles.lookupBtn}>
              Find
            </button>
          </div>
          {isKeyboardVisible && <VirtualKeyboard onKeyPress={handleKeyPress} />}
          {student && (
            <div style={styles.studentPanel}>
              <div style={styles.studentName}>{student.name}</div>
              <div style={styles.detailRow}>
                <div style={styles.detailLabel}>Card ID:</div>
                <div style={styles.detailValue}>{student.card_id}</div>
              </div>
              <div style={styles.detailRow}>
                <div style={styles.detailLabel}>Current Balance:</div>
                <div style={styles.detailValue}>
                  {CURRENCY}
                  {Number(student.balance).toFixed(2)}
                </div>
              </div>
              <div style={styles.detailRow}>
                <div style={styles.detailLabel}>Balance After Purchase:</div>
                <div style={styles.detailValue}>
                  {CURRENCY}
                  {Number(student.balance).toFixed(2) - cartTotal >= 0
                    ? (Number(student.balance) - cartTotal).toFixed(2)
                    : "0.00"}
                </div>
              </div>
              <div style={styles.detailRow}>
                <div style={styles.detailLabel}>Outstanding Debt:</div>
                <div style={{ ...styles.detailValue, color: "#EF4444" }}>
                  {CURRENCY}
                  {Number(student.outstanding || 0).toFixed(2)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div style={styles.rightPanel}>
        <div style={styles.totalLabel}>Transaction Amount</div>
        <div style={styles.totalAmount}>
          {CURRENCY}
          {cartTotal.toFixed(2)}
        </div>
        <button
          disabled={!student}
          onClick={charge}
          style={{
            ...styles.chargeBtn,
            ...(student ? {} : styles.disabledBtn),
          }}
        >
          Charge to Card
        </button>
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
    fontFamily: "sans-serif",
    boxSizing: "border-box",
  },
  leftPanel: { flex: 2, padding: "32px 24px", boxSizing: "border-box" },
  rightPanel: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    borderLeft: "1px solid #E2E8F0",
    boxSizing: "border-box",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 24,
  },
  inputContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  input: {
    flex: 1,
    border: "1px solid #CBD5E1",
    borderRadius: 12,
    padding: "14px 18px",
    fontSize: 20,
    backgroundColor: "#FFFFFF",
  },
  lookupBtn: {
    backgroundColor: "#10B981",
    padding: "0 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 18,
    border: "none",
    cursor: "pointer",
  },
  toggleBtn: {
    backgroundColor: "#64748B",
    padding: "0 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
    border: "none",
    cursor: "pointer",
  },
  studentPanel: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    border: "1px solid #E2E8F0",
    marginTop: 16,
  },
  studentName: {
    fontWeight: "bold",
    fontSize: 26,
    color: "#3B82F6",
    marginBottom: 16,
    borderBottom: "1px solid #E2E8F0",
    paddingBottom: 16,
  },
  detailRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  detailLabel: { fontSize: 18, color: "#475569" },
  detailValue: { fontSize: 18, fontWeight: 600, color: "#1E293B" },
  totalLabel: { fontSize: 24, color: "#64748B", marginBottom: 8 },
  totalAmount: {
    fontSize: 45,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 32,
  },
  chargeBtn: {
    backgroundColor: "#3B82F6",
    padding: "24px 0",
    borderRadius: 16,
    width: "100%",
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 22,
    border: "none",
    cursor: "pointer",
  },
  disabledBtn: { opacity: 0.5, cursor: "not-allowed" },
  keypad: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    marginTop: 8,
    padding: 8,
    backgroundColor: "#E2E8F0",
    borderRadius: 12,
  },
  keypadRow: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
  },
  keypadBtn: {
    flex: 1,
    minHeight: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    border: "none",
    boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
    cursor: "pointer",
  },
  keypadTxt: { fontSize: 20, fontWeight: 600, color: "#1E293B" },
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
