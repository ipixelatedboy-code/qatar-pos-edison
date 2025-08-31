import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../state/Store";

export default function LoginScreen() {
  const { login, setBranch } = useStore();
  const [staffNo, setStaffNo] = useState("0101");
  const [pin, setPin] = useState("0101");
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const API_BASE = "https://edison-qr.eagletechsolutions.co.uk/api";

  const onSubmit = async () => {
    setError("");
    if (!staffNo || !pin) {
      setError("Staff # and PIN are required.");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(
        `${API_BASE}/CategoriesApi/staff-branches?employeeId=${staffNo.trim()}&pin=${pin.trim()}`
      );

      if (!res.ok) throw new Error("Invalid credentials. Please try again.");
      const data = await res.json();

      if (!data || data.length === 0)
        throw new Error("No branches have been assigned to this staff member.");

      if (data.length === 1) {
        await login(staffNo.trim(), pin.trim());
        setBranch(data[0].branchId, data[0].branchName);
        navigate("/pos", { replace: true });
      } else {
        setBranches(data);
        setSelectedBranch(data[0].branchId); // Pre-select the first branch
      }
    } catch (e) {
      console.error("Login failed:", e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const onBranchSelect = async () => {
    if (!selectedBranch) {
      setError("Please select a branch.");
      return;
    }
    try {
      await login(staffNo.trim(), pin.trim());
      const selected = branches.find((b) => b.branchId === selectedBranch);
      if (selected) {
        setBranch(selected.branchId, selected.branchName);
        navigate("/pos", { replace: true });
      } else {
        setError("Selected branch not found.");
      }
    } catch (e) {
      setError(`Login Failed: ${e.message}`);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <div style={styles.header}>POS Login</div>

        {branches.length > 1 ? (
          <>
            <div style={styles.label}>Select Branch</div>
            <select
              style={styles.input}
              value={selectedBranch || ""}
              onChange={(e) => setSelectedBranch(Number(e.target.value))}
            >
              {branches.map((b) => (
                <option key={b.branchId} value={b.branchId}>
                  {b.branchName} ({b.branchId})
                </option>
              ))}
            </select>
            <button onClick={onBranchSelect} style={styles.btn}>
              CONTINUE
            </button>
          </>
        ) : (
          <>
            <div style={styles.label}>STAFF #</div>
            <input
              placeholder="Enter staff number"
              value={staffNo}
              onChange={(e) => setStaffNo(e.target.value)}
              style={styles.input}
              inputMode="numeric"
              disabled={loading}
            />
            <div style={styles.label}>PIN CODE</div>
            <input
              placeholder="Enter PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              style={styles.input}
              type="password"
              inputMode="numeric"
              disabled={loading}
            />
            <button onClick={onSubmit} style={styles.btn} disabled={loading}>
              {loading ? "CHECKING..." : "LOGIN"}
            </button>
          </>
        )}
        {error && <div style={styles.error}>{error}</div>}
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
  error: {
    color: "red",
    textAlign: "center",
    marginTop: "16px",
  },
};
