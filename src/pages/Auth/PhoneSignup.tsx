import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";

interface PhoneSignupProps {
  onSuccess: () => void;
}

const PhoneSignup: React.FC<PhoneSignupProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
    otp: ["", "", "", ""]
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [message, setMessage] = useState("");
  const [otpMethod, setOtpMethod] = useState<"whatsapp" | "sms">("whatsapp");
  const [secondsLeft, setSecondsLeft] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: [] });
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = [...formData.otp];
      newOtp[index] = value;
      setFormData({ ...formData, otp: newOtp });
      
      if (value && index < 3) {
        const nextInput = document.getElementById(`otp-input-${index + 1}`) as HTMLInputElement;
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleSendOtp = async (method: "whatsapp" | "sms") => {
    if (!formData.phone || formData.phone.length < 9 || formData.phone.length > 10) {
      setErrors({ ...errors, phone: ["Please enter a valid Pakistani phone number"] });
      return;
    }

    setOtpMethod(method);
    
    try {
      setLoading(true);
      const formattedPhone = `+92${formData.phone.replace(/^0+/, "")}`;
      const endpoint = method === "whatsapp" 
        ? "/api/send-whatsapp-otp" 
        : "/api/send-sms-otp";
      
      const response = await axios.post(`http://127.0.0.1:8000${endpoint}`, {
        phone: formattedPhone
      });

      if (response.data.success) {
        setOtpSent(true);
        setMessage(`OTP sent to your ${method === "whatsapp" ? "WhatsApp" : "SMS"}`);
        setSecondsLeft(60);
      } else {
        setErrors({ ...errors, phone: [response.data.message] });
      }
    } catch (err) {
      setErrors({ ...errors, phone: ["Failed to send OTP"] });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = formData.otp.join("");
    if (otpCode.length !== 4) {
      setErrors({ ...errors, otp: ["Please enter a valid 4-digit OTP"] });
      return;
    }

    try {
      setLoading(true);
      const formattedPhone = `+92${formData.phone.replace(/^0+/, "")}`;
      const response = await axios.post("http://127.0.0.1:8000/api/verify-phone-otp", {
        phone: formattedPhone,
        otp: otpCode
      });

      if (response.data.success) {
        setOtpVerified(true);
        setMessage("Phone number verified successfully");
      } else {
        setErrors({ ...errors, otp: [response.data.message] });
      }
    } catch (err) {
      setErrors({ ...errors, otp: ["Failed to verify OTP"] });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otpVerified) {
      setErrors({ ...errors, general: ["Please verify your phone first"] });
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
      const formattedPhone = `+92${formData.phone.replace(/^0+/, "")}`;
      const response = await axios.post("http://127.0.0.1:8000/api/register-phone", {
        name: formData.name,
        phone: formattedPhone,
        password: formData.password,
        password_confirmation: formData.confirmPassword
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
      <h4 className="text-lg font-medium mb-4">Sign up with Phone</h4>
      
      {!otpSent ? (
        <>
          <Form.Group className="mb-3">
            <Form.Label>Phone Number</Form.Label>
            <div className="flex">
              <div className="flex items-center px-3 bg-gray-100 border border-r-0 rounded-l-md">
                +92
              </div>
              <Form.Control
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, "");
                  const trimmed = raw.startsWith("0") ? raw.slice(1) : raw;
                  setFormData({ ...formData, phone: trimmed });
                }}
                isInvalid={!!errors.phone}
                className="rounded-l-none"
              />
            </div>
            <Form.Control.Feedback type="invalid">
              {errors.phone?.[0]}
            </Form.Control.Feedback>
          </Form.Group>

          <div className="space-y-2 mb-4">
            <Button
              variant="success"
              onClick={() => handleSendOtp("whatsapp")}
              disabled={!formData.phone || formData.phone.length < 9 || loading}
              className="w-full"
            >
              {loading ? "Sending..." : "Send OTP via WhatsApp"}
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => handleSendOtp("sms")}
              disabled={!formData.phone || formData.phone.length < 9 || loading}
              className="w-full"
            >
              {loading ? "Sending..." : "Send OTP via SMS"}
            </Button>
          </div>
        </>
      ) : !otpVerified ? (
        <>
          <div className="mb-3">
            <Form.Label>Verification Code</Form.Label>
            <div className="flex justify-between mb-2">
              {[0, 1, 2, 3].map((index) => (
                <Form.Control
                  key={index}
                  id={`otp-input-${index}`}
                  type="text"
                  value={formData.otp[index]}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  maxLength={1}
                  isInvalid={!!errors.otp}
                  className="text-center w-12 h-12 text-lg"
                />
              ))}
            </div>
            <Form.Control.Feedback type="invalid">
              {errors.otp?.[0]}
            </Form.Control.Feedback>
            <div className="text-sm text-gray-600 mt-2">
              {secondsLeft > 0 ? (
                `Resend code in ${secondsLeft} seconds`
              ) : (
                <button
                  type="button"
                  className="text-blue-600 hover:underline"
                  onClick={() => handleSendOtp(otpMethod)}
                >
                  Resend OTP
                </button>
              )}
            </div>
          </div>

          <Button
            variant="primary"
            onClick={handleVerifyOtp}
            disabled={formData.otp.some(d => !d) || loading}
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

export default PhoneSignup;