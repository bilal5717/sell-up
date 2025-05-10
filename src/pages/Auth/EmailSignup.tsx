import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";

interface EmailSignupProps {
  onSuccess: () => void;
}

const EmailSignup: React.FC<EmailSignupProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    verification_code: ""
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: [] });
    }
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSendOtp = async () => {
    if (!validateEmail(formData.email)) {
      setErrors({ ...errors, email: ["Please enter a valid email address"] });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("http://127.0.0.1:8000/api/send-verification-code", {
        email: formData.email
      });

      if (response.data.success) {
        setOtpSent(true);
        setMessage("Verification code sent to your email");
      } else {
        setErrors(response.data.errors || { email: ["Failed to send OTP"] });
      }
    } catch (err) {
      setErrors({ email: ["Failed to send OTP"] });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!formData.verification_code || formData.verification_code.length !== 4) {
      setErrors({ ...errors, verification_code: ["Please enter a valid 4-digit code"] });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("http://127.0.0.1:8000/api/verify-email-otp", {
        email: formData.email,
        otp: formData.verification_code
      });

      if (response.data.success) {
        setOtpVerified(true);
        setMessage("Email verified successfully");
      } else {
        setErrors({ ...errors, verification_code: [response.data.message] });
      }
    } catch (err) {
      setErrors({ ...errors, verification_code: ["Failed to verify OTP"] });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otpVerified) {
      setErrors({ ...errors, general: ["Please verify your email first"] });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors({ ...errors, confirmPassword: ["Passwords do not match"] });
      return;
    }

    if (formData.password.length < 8) {
      setErrors({ ...errors, password: ["Password must be at least 8 characters"] });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("http://127.0.0.1:8000/api/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
        verification_code: formData.verification_code
      });

      if (response.data.success) {
        setMessage("Registration successful! Redirecting...");
        localStorage.setItem("authToken", response.data.token);
        setTimeout(onSuccess, 1500);
      } else {
        setErrors(response.data.errors || {});
      }
    } catch (err) {
      setErrors({ general: ["Registration failed"] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h4 className="text-lg font-medium mb-4">Sign up with Email</h4>
      
      {!otpSent ? (
        <>
          <Form.Group className="mb-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email?.[0]}
            </Form.Control.Feedback>
          </Form.Group>

          <Button
            variant="primary"
            onClick={handleSendOtp}
            disabled={!formData.email || !validateEmail(formData.email) || loading}
            className="w-full mb-4"
          >
            {loading ? "Sending..." : "Send Verification Code"}
          </Button>
        </>
      ) : !otpVerified ? (
        <>
          <Form.Group className="mb-3">
            <Form.Label>Verification Code</Form.Label>
            <Form.Control
              type="text"
              name="verification_code"
              placeholder="Enter 4-digit code"
              value={formData.verification_code}
              onChange={handleChange}
              isInvalid={!!errors.verification_code}
            />
            <Form.Control.Feedback type="invalid">
              {errors.verification_code?.[0]}
            </Form.Control.Feedback>
          </Form.Group>

          <Button
            variant="primary"
            onClick={handleVerifyOtp}
            disabled={!formData.verification_code || formData.verification_code.length !== 4 || loading}
            className="w-full mb-4"
          >
            {loading ? "Verifying..." : "Verify Code"}
          </Button>
        </>
      ) : (
        <>
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name?.[0]}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <div className="relative">
              <Form.Control
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create password"
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

          <Form.Group className="mb-4">
            <Form.Label>Confirm Password</Form.Label>
            <div className="relative">
              <Form.Control
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                isInvalid={!!errors.confirmPassword}
              />
              <button
                type="button"
                className="absolute right-3 top-2 text-gray-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <Form.Control.Feedback type="invalid">
              {errors.confirmPassword?.[0]}
            </Form.Control.Feedback>
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </>
      )}

      {message && (
        <Alert variant={message.includes("success") ? "success" : "danger"} className="mt-3">
          {message}
        </Alert>
      )}
    </Form>
  );
};

export default EmailSignup;