import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../state/Store";

export default function LoginScreen() {
  const { login } = useStore();
  const [staffNo, setStaffNo] = useState("1001");
  const [pin, setPin] = useState("1234");
  const navigate = useNavigate();

  const onSubmit = async () => {
    try {
      await login(staffNo.trim(), pin.trim());
      navigate("/pos", { replace: true });
    } catch (e) {
      window.alert(`Login Failed: ${e.message}`);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <div style={styles.header}>School POS Login</div>
        <div style={styles.label}>STAFF # (Hint: 1001)</div>
        <input
          placeholder="Enter staff number"
          value={staffNo}
          onChange={(e) => setStaffNo(e.target.value)}
          style={styles.input}
          inputMode="numeric"
        />
        <div style={styles.label}>PIN CODE (Hint: 1234)</div>
        <input
          placeholder="Enter PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          style={styles.input}
          type="password"
          inputMode="numeric"
        />
        <button onClick={onSubmit} style={styles.btn}>
          LOGIN
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F4F8",
    fontFamily: "sans-serif",
  },
  loginBox: {
    width: "100%",
    maxWidth: 600,
    padding: "40px 32px",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
    color: "#1E293B",
  },
  label: { fontSize: 16, fontWeight: 600, color: "#475569", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    backgroundColor: "#F8FAFC",
    marginBottom: 16,
    width: "95%",
    borderStyle: "solid",
  },
  btn: {
    backgroundColor: "#3B82F6",
    padding: 20,
    borderRadius: 12,
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    width: "100%",
    border: "none",
    cursor: "pointer",
  },
};
