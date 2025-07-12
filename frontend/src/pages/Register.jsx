import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/esm/Container";
import Form from "react-bootstrap/Form";
import axios from "../api/axios"; // axios instance with baseURL + token interceptor
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const { login } = useAuth(); // From AuthContext
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [touched, setTouched] = useState({
    username: false,
    email: false,
    password: false,
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isFormValid = () => {
    return (
      formData.username.trim() !== "" &&
      formData.password.trim() !== "" &&
      isEmailValid(formData.email)
    );
  };

   const handleBlur = (e) => {
    const { name } = e.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/auth/register", formData);
      const { token, user } = res.data;

      login(user, token); // save to localStorage and AuthContext
      toast.success("Registered successfully!");

      navigate("/"); // redirect to home or profile
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div>
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "calc(100vh - 56px)" }}
      >
        <Form
          onSubmit={handleSubmit}
          style={{ width: "100%", maxWidth: "400px" }}
        >
          <h3 className="text-center mb-4">Register</h3>
          <Form.Group className="mb-3" controlId="formName">
            <Form.Label className="fw-bold">Full Name</Form.Label>
            <Form.Control
              type="username"
              name="username"
              placeholder="Enter full name"
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={touched.username && formData.username.trim() === ""}
            />
            <Form.Control.Feedback type="invalid">
              Full name is required.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Email address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={touched.email && !isEmailValid(formData.email)}
            />
            <Form.Control.Feedback type="invalid">
              Please enter a valid email address.
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-4" controlId="formBasicPassword">
            <Form.Label className="fw-bold">Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={touched.password && formData.password.trim() === ""}
            />
            <Form.Control.Feedback type="invalid">
              Password is required.
            </Form.Control.Feedback>
          </Form.Group>

          <div className="d-grid">
            <Button variant="primary" type="submit" disabled={!isFormValid()}>
              Submit
            </Button>
          </div>
        </Form>
      </Container>
    </div>
  );
};

export default Register;
