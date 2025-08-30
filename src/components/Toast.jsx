import React, { useEffect } from "react";

export default function Toast({ message, onClose, duration = 2000 }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [message, onClose, duration]);

  if (!message) return null;
  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        left: "50%",
        transform: "translateX(-50%)",
        background: "#111827",
        color: "#fff",
        padding: "10px 16px",
        borderRadius: 8,
        fontWeight: 600,
        boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
        zIndex: 9999,
        fontFamily: "sans-serif",
      }}
    >
      {message}
    </div>
  );
}
