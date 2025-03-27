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

  const categories = [
    "Electronics",
    "Clothing",
    "Home Appliances",
    "Books",
    "Toys",
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProduct({ ...product, image: file });
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
          <Form.Label>Category</Form.Label>
          <Form.Select
            name="category"
            value={product.category}
            onChange={handleChange}
          >
            <option value="">Select Category</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mt-2">
          <Form.Label>Upload Image</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleImageChange}
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
