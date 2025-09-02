// // import React, { useEffect, useRef } from "react";
// // import { useStore } from "../state/Store";
// // import { useLocation, useNavigate } from "react-router-dom";

// // const Receipt = () => {
// //   const { state } = useLocation();
// //   const navigate = useNavigate();
// //   const { branchName, CURRENCY } = useStore();
// //   const receiptRef = useRef(null);

// //   // Get the transaction data from the navigation state
// //   const transaction = state?.transaction;

// //   useEffect(() => {
// //     if (!transaction) {
// //       // If no transaction data, redirect back to POS
// //       navigate("/pos", { replace: true });
// //       return;
// //     }

// //     const handlePrint = () => {
// //       // Focus on the receipt element before printing
// //       if (receiptRef.current) {
// //         receiptRef.current.focus();
// //       }
// //       window.print();
// //       // Go back to the POS screen after printing or cancellation
// //       navigate("/pos", { replace: true });
// //     };

// //     const timeoutId = setTimeout(handlePrint, 500); // Give a short delay to render

// //     // Clean up the timeout
// //     return () => clearTimeout(timeoutId);
// //   }, [transaction, navigate]);

// //   if (!transaction) {
// //     return null; // Don't render if there's no transaction data
// //   }

// //   return (
// //     <div style={styles.container}>
// //       <div ref={receiptRef} style={styles.receipt} tabIndex="-1">
// //         <div style={styles.header}>
// //           <h2 style={styles.schoolName}>Edison School</h2>
// //           <p style={styles.branchName}>{branchName}</p>
// //           <hr style={styles.divider} />
// //         </div>

// //         <div style={styles.itemsSection}>
// //           <div style={styles.itemHeader}>
// //             <span style={styles.itemHeaderText}>Item</span>
// //             <span style={styles.itemHeaderText}>Price</span>
// //           </div>
// //           {transaction.items.map((item) => (
// //             <div key={item.id} style={styles.itemRow}>
// //               <span style={styles.itemText}>
// //                 {item.qty} x {item.name}
// //               </span>
// //               <span style={styles.itemText}>
// //                 {CURRENCY} {(item.qty * item.price).toFixed(2)}
// //               </span>
// //             </div>
// //           ))}
// //           <hr style={styles.divider} />
// //         </div>

// //         <div style={styles.totalSection}>
// //           <div style={styles.totalRow}>
// //             <span style={styles.totalLabel}>TOTAL</span>
// //             <span style={styles.totalValue}>
// //               {CURRENCY} {transaction.subtotal.toFixed(2)}
// //             </span>
// //           </div>
// //           <div style={styles.totalRow}>
// //             <span style={styles.totalLabel}>PAYMENT METHOD</span>
// //             <span style={styles.totalValue}>{transaction.payment_method}</span>
// //           </div>
// //           <div style={styles.totalRow}>
// //             <span style={styles.totalLabel}>DATE & TIME</span>
// //             <span style={styles.totalValue}>
// //               {new Date(transaction.ts).toLocaleString()}
// //             </span>
// //           </div>
// //         </div>

// //         <div style={styles.footer}>
// //           <p>Thank you for your purchase!</p>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // const styles = {
// //   container: {
// //     display: "flex",
// //     justifyContent: "center",
// //     alignItems: "flex-start",
// //     minHeight: "100vh",
// //     backgroundColor: "#f0f4f8",
// //     padding: "2rem",
// //   },
// //   receipt: {
// //     backgroundColor: "#fff",
// //     padding: "2rem",
// //     width: "100%",
// //     maxWidth: "300px",
// //     boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
// //     fontFamily: "monospace",
// //     fontSize: "14px",
// //     lineHeight: "1.5",
// //   },
// //   header: {
// //     textAlign: "center",
// //     marginBottom: "1rem",
// //   },
// //   schoolName: {
// //     fontSize: "1.5rem",
// //     margin: "0",
// //   },
// //   branchName: {
// //     fontSize: "1rem",
// //     margin: "0",
// //   },
// //   divider: {
// //     borderTop: "1px dashed #000",
// //     margin: "1rem 0",
// //   },
// //   itemsSection: {
// //     marginBottom: "1rem",
// //   },
// //   itemHeader: {
// //     display: "flex",
// //     justifyContent: "space-between",
// //     fontWeight: "bold",
// //     marginBottom: "0.5rem",
// //   },
// //   itemHeaderText: {
// //     textTransform: "uppercase",
// //   },
// //   itemRow: {
// //     display: "flex",
// //     justifyContent: "space-between",
// //   },
// //   itemText: {
// //     whiteSpace: "nowrap",
// //     overflow: "hidden",
// //     textOverflow: "ellipsis",
// //   },
// //   totalSection: {
// //     marginBottom: "1rem",
// //   },
// //   totalRow: {
// //     display: "flex",
// //     justifyContent: "space-between",
// //     marginBottom: "0.5rem",
// //   },
// //   totalLabel: {
// //     fontWeight: "bold",
// //   },
// //   totalValue: {},
// //   footer: {
// //     textAlign: "center",
// //     fontSize: "12px",
// //     marginTop: "1rem",
// //     paddingTop: "1rem",
// //     borderTop: "1px dashed #000",
// //   },
// //   // Media query for printing
// //   "@media print": {
// //     container: {
// //       padding: "0",
// //       margin: "0",
// //     },
// //     receipt: {
// //       boxShadow: "none",
// //       border: "none",
// //     },
// //     // Adjust font sizes for print if needed
// //     schoolName: {
// //       fontSize: "1.2rem",
// //     },
// //     branchName: {
// //       fontSize: "0.9rem",
// //     },
// //   },
// // };

// // export default Receipt;
// import React, { useEffect, useRef } from "react";
// import { useStore } from "../state/Store";
// import { useLocation, useNavigate } from "react-router-dom";

// const Receipt = () => {
//   const { state } = useLocation();
//   const navigate = useNavigate();
//   const { branchName, CURRENCY } = useStore();
//   const receiptRef = useRef(null);

//   const transaction = state?.transaction;

//   useEffect(() => {
//     if (!transaction) {
//       navigate("/pos", { replace: true });
//       return;
//     }

//     const handlePrint = () => {
//       if (receiptRef.current) receiptRef.current.focus();
//       window.print();
//       navigate("/pos", { replace: true });
//     };

//     const timeoutId = setTimeout(handlePrint, 500);
//     return () => clearTimeout(timeoutId);
//   }, [transaction, navigate]);

//   if (!transaction) return null;

//   return (
//     <div style={styles.container}>
//       <style>
//         {`
//           @media print {
//             body { margin:0; padding:0; }
//             .receipt {
//               width: 80mm !important;
//               max-width: none !important;
//               box-shadow: none !important;
//               border: none !important;
//               margin: 0 auto !important;
//               background: #fff !important;
//               padding: 0 !important;
//             }
//           }
//         `}
//       </style>

//       <div
//         ref={receiptRef}
//         className="receipt"
//         style={styles.receipt}
//         tabIndex="-1"
//       >
//         <div style={styles.header}>
//           <h2 style={styles.schoolName}>Edison School</h2>
//           <p style={styles.branchName}>{branchName}</p>
//           <hr style={styles.divider} />
//         </div>

//         <div style={styles.itemsSection}>
//           <div style={styles.itemHeader}>
//             <span style={styles.itemHeaderText}>Item</span>
//             <span style={styles.itemHeaderText}>Price (QR)</span>
//           </div>
//           {transaction.items.map((item) => (
//             <div key={item.id} style={styles.itemRow}>
//               <span style={styles.itemText}>
//                 {item.qty} x {item.name}
//               </span>
//               <span style={styles.itemPrice}>
//                 {(item.qty * item.price).toFixed(2)}
//               </span>
//             </div>
//           ))}
//           <hr style={styles.divider} />
//         </div>

//         <div style={styles.totalSection}>
//           <div style={styles.totalRow}>
//             <span style={styles.totalLabel}>TOTAL</span>
//             <span style={styles.totalValue}>
//               {CURRENCY} {transaction.subtotal.toFixed(2)}
//             </span>
//           </div>
//           <div style={styles.totalRow}>
//             <span style={styles.totalLabel}>PAYMENT METHOD</span>
//             <span style={styles.totalValue}>{transaction.payment_method}</span>
//           </div>
//           <div style={styles.totalRow}>
//             <span style={styles.totalLabel}>DATE & TIME</span>
//             <span style={styles.totalValue}>
//               {new Date(transaction.ts).toLocaleString()}
//             </span>
//           </div>
//         </div>

//         <div style={styles.footer}>
//           <p>Thank you for your purchase!</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "flex-start",
//     minHeight: "100vh",
//     backgroundColor: "#f0f4f8",
//     padding: "2rem",
//   },
//   receipt: {
//     backgroundColor: "#fff",
//     padding: "1rem",
//     width: "80mm",
//     fontFamily: "monospace",
//     fontSize: "14px",
//     lineHeight: "1.5",
//     boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
//   },
//   header: { textAlign: "center", marginBottom: "1rem" },
//   schoolName: { fontSize: "1.2rem", margin: 0 },
//   branchName: { fontSize: "0.9rem", margin: 0 },
//   divider: { borderTop: "1px dashed #000", margin: "1rem 0" },
//   itemsSection: { marginBottom: "1rem" },
//   itemHeader: {
//     display: "flex",
//     justifyContent: "space-between",
//     fontWeight: "bold",
//     marginBottom: "0.5rem",
//   },
//   itemHeaderText: { textTransform: "uppercase" },
//   itemRow: { display: "flex", justifyContent: "space-between" },
//   itemText: {
//     flex: 1,
//     whiteSpace: "normal", // allow wrapping
//     wordBreak: "break-word",
//     overflowWrap: "break-word",
//     marginRight: "0.5rem",
//   },
//   itemPrice: { flexShrink: 0, textAlign: "right" },
//   totalSection: { marginBottom: "1rem" },
//   totalRow: {
//     display: "flex",
//     justifyContent: "space-between",
//     marginBottom: "0.5rem",
//   },
//   totalLabel: { fontWeight: "bold" },
//   totalValue: {},
//   footer: {
//     textAlign: "center",
//     fontSize: "12px",
//     marginTop: "1rem",
//     paddingTop: "1rem",
//     borderTop: "1px dashed #000",
//   },
// };

// export default Receipt;
// import React, { useEffect, useRef } from "react";
// import { useStore } from "../state/Store";
// import { useLocation, useNavigate } from "react-router-dom";

// const Receipt = () => {
//   const { state } = useLocation();
//   const navigate = useNavigate();
//   const { branchName, CURRENCY } = useStore();
//   const receiptRef = useRef(null);

//   const transaction = state?.transaction;

//   useEffect(() => {
//     if (!transaction) {
//       navigate("/pos", { replace: true });
//       return;
//     }

//     const handlePrint = () => {
//       // No need to focus, just print
//       window.print();
//       navigate("/pos", { replace: true });
//     };

//     // Delay allows the page to render fully before printing
//     const timeoutId = setTimeout(handlePrint, 500);
//     return () => clearTimeout(timeoutId);
//   }, [transaction, navigate]);

//   if (!transaction) return null;

//   return (
//     <div style={styles.container}>
//       {/* --- This is the crucial part for receipt printing --- */}
//       <style>
//         {`
//           /* This @page rule removes browser-added headers and footers */
//           @page {
//             size: 80mm auto; /* Set width, height is automatic */
//             margin: 0;
//           }

//           @media print {
//             /* Hide everything except the receipt itself */
//             body > *:not(.receipt-container) {
//               display: none;
//             }

//             /* Ensure the container and body have no margins or padding */
//             html, body {
//               margin: 0 !important;
//               padding: 0 !important;
//               background: #fff;
//             }

//             .receipt-container {
//               display: block !important;
//               padding: 0 !important;
//               margin: 0 !important;
//             }

//             .receipt {
//               width: 100% !important;
//               max-width: none !important;
//               box-shadow: none !important;
//               border: none !important;
//               margin: 0 !important;
//               padding: 0 !important;
//               font-size: 12px; /* Smaller font for thermal printers */
//             }
//           }
//         `}
//       </style>

//       {/* Added a wrapper class for better print targeting */}
//       <div
//         ref={receiptRef}
//         className="receipt-container" // Use a class for the print styles
//         style={styles.receipt}
//         tabIndex="-1"
//       >
//         <div style={styles.header}>
//           <h2 style={styles.schoolName}>Edison School</h2>
//           <p style={styles.branchName}>{branchName}</p>
//         </div>

//         <div style={styles.divider}>--------------------------------</div>

//         <table style={styles.table}>
//           <thead>
//             <tr>
//               <th style={{ ...styles.tableHeader, ...styles.textLeft }}>
//                 Item
//               </th>
//               <th style={{ ...styles.tableHeader, ...styles.textRight }}>
//                 Price
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {transaction.items.map((item) => (
//               <tr key={item.id}>
//                 <td style={styles.tableCell}>
//                   {item.qty} x {item.name}
//                 </td>
//                 <td style={{ ...styles.tableCell, ...styles.textRight }}>
//                   {(item.qty * item.price).toFixed(2)}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         <div style={styles.divider}>--------------------------------</div>

//         <div style={styles.totalSection}>
//           <div style={styles.totalRow}>
//             <span style={styles.totalLabel}>TOTAL</span>
//             <span style={styles.totalValue}>
//               {CURRENCY} {transaction.subtotal.toFixed(2)}
//             </span>
//           </div>
//           <div style={styles.totalRow}>
//             <span style={styles.totalLabel}>PAYMENT METHOD</span>
//             <span style={styles.totalValue}>{transaction.payment_method}</span>
//           </div>
//           <div style={styles.totalRow}>
//             <span style={styles.totalLabel}>DATE & TIME</span>
//             <span style={styles.totalValue}>
//               {new Date(transaction.ts).toLocaleString()}
//             </span>
//           </div>
//         </div>

//         <div style={styles.footer}>
//           <p>Thank you for your purchase!</p>
//         </div>
//       </div>
//     </div>
//   );
// };

import React, { useEffect } from "react";
import { useStore } from "../state/Store";
import { useLocation, useNavigate } from "react-router-dom";

const Receipt = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { branchName, CURRENCY } = useStore();

  const transaction = state?.transaction;

  useEffect(() => {
    if (!transaction) {
      navigate("/pos", { replace: true });
      return;
    }

    // Delay ensures DOM is ready before print
    const timeoutId = setTimeout(() => {
      window.print();
      navigate("/pos", { replace: true });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [transaction, navigate]);

  if (!transaction) return null;

  return (
    <div className="receipt">
      <style>
        {`
          @page {
            size: 80mm auto;
            margin: 0;
          }
          @media print {
            body {
              margin: 0;
              padding: 0;
              font-family: monospace;
              font-size: 12px;
              line-height: 1.4;
            }
            .receipt {
              width: 100%;
              padding: 0;
              margin: 0;
            }
          }
        `}
      </style>
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <strong>Edison School</strong>
        <br />
        {branchName}
      </div>
      --------------------------------
      <br />
      <table style={{ width: "100%" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left" }}>Item</th>
            <th style={{ textAlign: "right" }}>Price</th>
          </tr>
        </thead>
        <tbody>
          {transaction.items.map((item) => (
            <tr key={item.id}>
              <td>
                {item.qty} x {item.name}
              </td>
              <td style={{ textAlign: "right" }}>
                {(item.qty * item.price).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      --------------------------------
      <br />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>TOTAL</span>
        <span>
          {CURRENCY} {transaction.subtotal.toFixed(2)}
        </span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>PAYMENT</span>
        <span>{transaction.payment_method}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>DATE</span>
        <span>{new Date(transaction.ts).toLocaleString()}</span>
      </div>
      <br />
      <div style={{ textAlign: "center" }}>Thank you for your purchase!</div>
    </div>
  );
};

// Simplified styles for better thermal printer compatibility
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "#f0f4f8",
  },
  receipt: {
    backgroundColor: "#fff",
    padding: "1rem",
    width: "80mm", // Standard receipt width
    fontFamily: '"Courier New", Courier, monospace', // Use a true monospace font
    fontSize: "14px",
    lineHeight: "1.4",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  },
  header: { textAlign: "center", marginBottom: "10px" },
  schoolName: { fontSize: "1.2rem", margin: 0, fontWeight: "bold" },
  branchName: { fontSize: "0.9rem", margin: 0 },
  divider: { textAlign: "center", margin: "10px 0", fontSize: "12px" },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeader: {
    textTransform: "uppercase",
    paddingBottom: "5px",
    borderBottom: "1px dashed #000",
  },
  tableCell: {
    padding: "5px 0",
    verticalAlign: "top",
  },
  textLeft: { textAlign: "left" },
  textRight: { textAlign: "right" },
  totalSection: { marginTop: "10px" },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "2px 0",
  },
  totalLabel: { fontWeight: "bold" },
  totalValue: { textAlign: "right" },
  footer: {
    textAlign: "center",
    fontSize: "12px",
    marginTop: "15px",
    paddingTop: "10px",
    borderTop: "1px dashed #000",
  },
};

export default Receipt;
