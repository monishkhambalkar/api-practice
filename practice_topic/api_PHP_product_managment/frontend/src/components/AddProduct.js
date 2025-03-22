import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";

const AddProduct = () => {
  const [product, setProduct] = useState({ name: "", price: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    // You can save product to backend or state
    console.log("Product added:", product);
    navigate("/"); // Redirect to product list
  };

  return (
    <Container className="mt-4">
      <h2>Add Product</h2>
      <Form>
        <Form.Group>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mt-2">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
          />
        </Form.Group>
        <Button className="mt-3" variant="primary" onClick={handleSubmit}>
          Save
        </Button>
      </Form>
    </Container>
  );
};

export default AddProduct;
