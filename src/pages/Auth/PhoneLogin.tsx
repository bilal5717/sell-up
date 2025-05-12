import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import axios from "axios";

interface PhoneLoginProps {
  onSuccess: () => void;
}

const PhoneLogin: React.FC<PhoneLoginProps> = ({ onSuccess }) => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");
  const [otpMethod, setOtpMethod] = useState<"whatsapp" | "sms">("whatsapp");
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (secondsLeft > 0) {
      const timer = setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [secondsLeft]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    const trimmed = raw.startsWith("0") ? raw.slice(1) : raw;
    setPhone(trimmed);
    if (errors.phone) {
      setErrors({ ...errors, phone: [] });
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      if (value && index < 3) {
        const nextInput = document.getElementById(`otp-input-${index + 1}`) as HTMLInputElement;
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleSendOtp = async (method: "whatsapp" | "sms") => {
    if (!phone || phone.length < 9 || phone.length > 10) {
      setErrors({ ...errors, phone: ["Please enter a valid Pakistani phone number"] });
      return;
    }

    setOtpMethod(method);
    
    try {
      setLoading(true);
      const formattedPhone = `+92${phone}`;
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

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length !== 4) {
      setErrors({ ...errors, otp: ["Please enter a valid 4-digit OTP"] });
      return;
    }

    try {
      setLoading(true);
      const formattedPhone = `+92${phone}`;
      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/verify-otp",
        {
          phone: formattedPhone,
          otp: otpCode,
          method: "phone"
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        setMessage("Login successful!");
        localStorage.setItem("authToken", response.data.token);
        setTimeout(onSuccess, 1000);
      } else {
        setErrors({ ...errors, otp: [response.data.message] });
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 422) {
          setErrors(err.response.data.errors as Record<string, string[]>);
        } else {
          setMessage(err.response?.data?.message || "Invalid OTP. Please try again.");
        }
      } else {
        setMessage("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleVerifyOtp}>
      <h4 className="text-lg font-medium mb-4">Login with Phone</h4>
      
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
                value={phone}
                onChange={handlePhoneChange}
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
              disabled={!phone || phone.length < 9 || loading}
              className="w-full"
            >
              {loading ? "Sending..." : "Send OTP via WhatsApp"}
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => handleSendOtp("sms")}
              disabled={!phone || phone.length < 9 || loading}
              className="w-full"
            >
              {loading ? "Sending..." : "Send OTP via SMS"}
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="mb-3">
            <Form.Label>Verification Code</Form.Label>
            <div className="flex justify-between mb-2">
              {[0, 1, 2, 3].map((index) => (
                <Form.Control
                  key={index}
                  id={`otp-input-${index}`}
                  type="text"
                  value={otp[index]}
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

          <div className="space-y-2">
            <Button
              variant="primary"
              type="submit"
              disabled={otp.some(d => !d) || loading}
              className="w-full"
            >
              {loading ? "Verifying..." : "Login"}
            </Button>
            <Button
              variant="link"
              type="button"
              onClick={() => {
                setOtpSent(false);
                setOtp(["", "", "", ""]);
                setMessage("");
              }}
              className="w-full text-sm"
            >
              Change Phone Number
            </Button>
          </div>
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

export default PhoneLogin;