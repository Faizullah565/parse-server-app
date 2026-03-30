import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { OrderProvider } from "./context/OrderContext.jsx";
import { AdminOrdersProvider } from "./admin/adminContext/AdminOrdersContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <AuthProvider>
    <CartProvider>
      <OrderProvider>
        <AdminOrdersProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AdminOrdersProvider>
      </OrderProvider>
    </CartProvider>
  </AuthProvider>
  // </React.StrictMode>
);