import "./App.css";
import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const ProductManagement = lazy(() => import("./components/ShowProduct"));
const AddProduct = lazy(() => import("./components/AddProduct"));
const UpdateProduct = lazy(() => import("./components/UpdateProduct"));
const OAuthLogin = lazy(() => import("./components/OAuthLogin"));
const Login = lazy(() => import("./components/Login"));
const Register = lazy(() => import("./components/Register"));

const Loading = () => (
  <div className="d-flex justify-content-center align-items-center vh-100">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/o-auth" element={<OAuthLogin />} />
          <Route path="/show-products" element={<ProductManagement />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/update-product/:id" element={<UpdateProduct />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
