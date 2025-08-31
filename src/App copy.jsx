import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { StoreProvider } from "./state/Store";
import LoginScreen from "./screens/LoginScreen";
import POSScreen from "./screens/POSScreen";
import ScanCardScreen from "./screens/ScanCardScreen";
import CashPaymentScreen from "./screens/CashPaymentScreen";
import HistoryScreen from "./screens/HistoryScreen";

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/pos" element={<POSScreen />} />
          <Route path="/scan-card" element={<ScanCardScreen />} />
          <Route path="/cash" element={<CashPaymentScreen />} />
          <Route path="/history" element={<HistoryScreen />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
}
