import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import ProductManagement from "./components/ShowProduct";
import AddProduct from "./components/AddProduct";
import UpdateProduct from "./components/UpdateProduct";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProductManagement />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/update-product/:id" element={<UpdateProduct />} />
      </Routes>
    </Router>
  );
}

export default App;
