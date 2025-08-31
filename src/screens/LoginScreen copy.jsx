import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../state/Store";

export default function LoginScreen() {
  const { login, setBranch } = useStore();
  const [staffNo, setStaffNo] = useState("1001");
  const [pin, setPin] = useState("1234");
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
const API_BASE = import.meta.env.VITE_API_BASE || '/api';

  const onSubmit = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${API_BASE}/CategoriesApi/staff-branches?employeeId=${staffNo.trim()}&pin=${pin.trim()}`
      );

      if (!res.ok) throw new Error("Invalid credentials");
      const data = await res.json();

      if (data.length === 0) throw new Error("No branches assigned");

      if (data.length === 1) {
        await login(staffNo.trim(), pin.trim());
        setBranch(data[0].branchId, data[0].branchName);
        navigate("/pos", { replace: true });
      } else {
        setBranches(data);
      }
    } catch (e) {
      console.error("Login failed:", e);
      window.alert(`Login Failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const onBranchSelect = async () => {
    if (!selectedBranch) {
      window.alert("Please select a branch");
      return;
    }
    try {
      await login(staffNo.trim(), pin.trim());
      const selected = branches.find((b) => b.branchId === selectedBranch);
      setBranch(selected.branchId, selected.branchName);
      navigate("/pos", { replace: true });
    } catch (e) {
      window.alert(`Login Failed: ${e.message}`);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <div style={styles.header}>School POS Login</div>

        {branches.length > 1 ? (
          <>
            <div style={styles.label}>Select Branch</div>
            <select
              style={styles.input}
              value={selectedBranch || ""}
              onChange={(e) => setSelectedBranch(Number(e.target.value))}
            >
              <option value="">-- Select Branch --</option>
              {branches.map((b) => (
                <option key={b.branchId} value={b.branchId}>
                  {b.branchName}
                </option>
              ))}
            </select>
            <button onClick={onBranchSelect} style={styles.btn}>
              CONTINUE
            </button>
          </>
        ) : (
          <>
            <div style={styles.label}>STAFF # (Hint: 1001)</div>
            <input
              placeholder="Enter staff number"
              value={staffNo}
              onChange={(e) => setStaffNo(e.target.value)}
              style={styles.input}
              inputMode="numeric"
              disabled={loading}
            />
            <div style={styles.label}>PIN CODE (Hint: 1234)</div>
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
              {loading ? "Checking..." : "LOGIN"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// styles remain unchanged

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useStore } from "../state/Store";

// export default function LoginScreen() {
//   const { login, setBranch } = useStore();
//   const [staffNo, setStaffNo] = useState("1001");
//   const [pin, setPin] = useState("1234");
//   const [branches, setBranches] = useState([]);
//   const [selectedBranch, setSelectedBranch] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();
//   const API_BASE = import.meta.env.VITE_API_BASE || "/api";

//   const onSubmit = async () => {
//     try {
//       setLoading(true);
//       const data = await login(staffNo.trim(), pin.trim());
//       if (!data || data.length === 0) throw new Error("No branches assigned");

//       if (data.length === 1) {
//         setBranch(data[0].branchId, data[0].branchName);
//         navigate("/pos", { replace: true });
//       } else {
//         setBranches(data);
//       }
//     } catch (e) {
//       console.error("Login failed:", e);
//       window.alert(`Login Failed: ${e.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onBranchSelect = async () => {
//     if (!selectedBranch) {
//       window.alert("Please select a branch");
//       return;
//     }
//     const selected = branches.find((b) => b.branchId === selectedBranch);
//     await login(staffNo.trim(), pin.trim(), selected);
//     navigate("/pos", { replace: true });
//   };

//   return (
//     <div style={styles.container}>
//       <div style={styles.loginBox}>
//         <div style={styles.header}>School POS Login</div>

//         {branches.length > 1 ? (
//           <>
//             <div style={styles.label}>Select Branch</div>
//             <select
//               style={styles.input}
//               value={selectedBranch || ""}
//               onChange={(e) => setSelectedBranch(Number(e.target.value))}
//             >
//               <option value="">-- Select Branch --</option>
//               {branches.map((b) => (
//                 <option key={b.branchId} value={b.branchId}>
//                   {b.branchName}
//                 </option>
//               ))}
//             </select>
//             <button onClick={onBranchSelect} style={styles.btn}>
//               CONTINUE
//             </button>
//           </>
//         ) : (
//           <>
//             <div style={styles.label}>STAFF #</div>
//             <input
//               placeholder="Enter staff number"
//               value={staffNo}
//               onChange={(e) => setStaffNo(e.target.value)}
//               style={styles.input}
//               inputMode="numeric"
//               disabled={loading}
//             />
//             <div style={styles.label}>PIN CODE</div>
//             <input
//               placeholder="Enter PIN"
//               value={pin}
//               onChange={(e) => setPin(e.target.value)}
//               style={styles.input}
//               type="password"
//               inputMode="numeric"
//               disabled={loading}
//             />
//             <button onClick={onSubmit} style={styles.btn} disabled={loading}>
//               {loading ? "Checking..." : "LOGIN"}
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

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
