import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";

interface EmailLoginProps {
  onSuccess: () => void;
}

const EmailLogin: React.FC<EmailLoginProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: [] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setMessage("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/login",
        {
          login: formData.email,
          password: formData.password,
          method: "email"
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        setMessage("Login successful!");
        localStorage.setItem("authToken", response.data.token);
        setTimeout(onSuccess, 1000);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 422) {
          setErrors(err.response.data.errors as Record<string, string[]>);
        } else {
          setMessage(err.response?.data?.message || "Login failed. Please check your credentials.");
        }
      } else {
        setMessage("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h4 className="text-lg font-medium mb-4">Login with Email</h4>
      
      <Form.Group className="mb-3">
        <Form.Label>Email Address</Form.Label>
        <Form.Control
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          isInvalid={!!errors.login}
        />
        <Form.Control.Feedback type="invalid">
          {errors.login?.[0]}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <div className="relative">
          <Form.Control
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            isInvalid={!!errors.password}
          />
          <button
            type="button"
            className="absolute right-3 top-2 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <Form.Control.Feedback type="invalid">
          {errors.password?.[0]}
        </Form.Control.Feedback>
      </Form.Group>

      <div className="flex justify-between items-center mb-4">
        <Form.Check 
          type="checkbox"
          label="Remember me"
          className="text-sm"
        />
        <button type="button" className="text-sm text-blue-600 hover:underline">
          Forgot password?
        </button>
      </div>

      <Button
        variant="primary"
        type="submit"
        disabled={loading}
        className="w-full mb-3"
      >
        {loading ? "Logging in..." : "Login"}
      </Button>

      {message && (
        <Alert variant={message.includes("success") ? "success" : "danger"} className="mt-3">
          {message}
        </Alert>
      )}
    </Form>
  );
};

export default EmailLogin;