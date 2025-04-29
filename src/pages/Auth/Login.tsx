import React, { useState } from "react";
import { Form, InputGroup, Button, Alert } from "react-bootstrap";
import { FaEye, FaEyeSlash, FaFacebook } from "react-icons/fa";
import Image from "next/image";
import Google from '@/public/images/socialicons/search.png';
import axios from "axios";

type LoginProps = {
  loginMethod: "phone" | "email";
  setLoginMethod: (method: "phone" | "email") => void;
  switchToSignup: () => void;
  handleLoginSubmit: (e: React.FormEvent, method: "phone" | "email") => void; // Not used now but preserved
};

const Login: React.FC<LoginProps> = ({
  loginMethod,
  setLoginMethod,
  switchToSignup,
}) => {
  const [phoneLogin, setPhoneLogin] = useState({ phone: "", password: "" });
  const [emailLogin, setEmailLogin] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [message, setMessage] = useState<string | null>(null);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setMessage(null);

    const loginData =
      loginMethod === "phone"
        ? {
            login: phoneLogin.phone,
            password: phoneLogin.password,
            method: "phone",
          }
        : {
            login: emailLogin.email,
            password: emailLogin.password,
            method: "email",
          };

    try {
      const response = await axios.post("http://localhost:8000/api/auth/login", loginData, {
        withCredentials: true,
      });

      if (response.data.success) {
        setMessage("Login successful!");
        localStorage.setItem("authToken", response.data.token);
        // redirect logic here if needed
      }
    } catch (err: any) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors);
      } else {
        setMessage(err.response?.data?.message || "Login failed.");
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <div className="d-flex justify-content-center mb-3">
        <div className="btn-group">
          <button
            type="button"
            className={`btn ${loginMethod === "email" ? "btn-danger" : "btn-outline-secondary"}`}
            onClick={() => setLoginMethod("email")}
          >
            Email
          </button>
          <button
            type="button"
            className={`btn ${loginMethod === "phone" ? "btn-danger" : "btn-outline-secondary"}`}
            onClick={() => setLoginMethod("phone")}
          >
            Phone
          </button>
        </div>
      </div>

      {loginMethod === "phone" ? (
        <>
          <Form.Group className="mb-2">
            <div className="input-group">
              <span className="input-group-text">
                <img src="https://flagcdn.com/w20/pk.png" alt="PK" width={24} />
                <span className="mx-1">+92</span>
              </span>
              <Form.Control
                type="tel"
                placeholder="Phone Number"
                value={phoneLogin.phone}
                onChange={(e) => setPhoneLogin({ ...phoneLogin, phone: e.target.value })}
              />
            </div>
            {errors.login && <div className="text-danger small mt-1">{errors.login}</div>}
          </Form.Group>

          <Form.Group className="mb-2">
            <InputGroup>
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={phoneLogin.password}
                onChange={(e) => setPhoneLogin({ ...phoneLogin, password: e.target.value })}
              />
              <InputGroup.Text onClick={togglePasswordVisibility} style={{ cursor: "pointer" }}>
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </InputGroup.Text>
            </InputGroup>
            {errors.password && <div className="text-danger small mt-1">{errors.password}</div>}
          </Form.Group>
        </>
      ) : (
        <>
          <Form.Group className="mb-2">
            <Form.Control
              type="email"
              placeholder="Email Address"
              value={emailLogin.email}
              onChange={(e) => setEmailLogin({ ...emailLogin, email: e.target.value })}
            />
            {errors.login && <div className="text-danger small mt-1">{errors.login}</div>}
          </Form.Group>

          <Form.Group className="mb-2">
            <InputGroup>
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={emailLogin.password}
                onChange={(e) => setEmailLogin({ ...emailLogin, password: e.target.value })}
              />
              <InputGroup.Text onClick={togglePasswordVisibility} style={{ cursor: "pointer" }}>
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </InputGroup.Text>
            </InputGroup>
            {errors.password && <div className="text-danger small mt-1">{errors.password}</div>}
          </Form.Group>
        </>
      )}

      {message && <Alert variant="danger" className="mt-2">{message}</Alert>}

      <div className="d-flex justify-content-between mb-3">
        <Form.Check type="checkbox" label="Remember Me" />
        <a href="#" className="text-danger small">Forgot Password?</a>
      </div>

      <Button type="submit" variant="danger" className="w-100">Login</Button>

      <div className="text-center mt-3">
        <p className="small">
          New to SellUp? <span className="text-danger cursor-pointer" onClick={switchToSignup}>Sign Up</span>
        </p>
      </div>

      <div className="text-center mt-4">
        <p className="divider-text small">or Login with</p>
        <div className="d-flex justify-content-center gap-3">
          <Button variant="outline-secondary" className="social-btn">
            <FaFacebook fontSize={20} color="#1877f2" />
            <span className="mx-2">Facebook</span>
          </Button>
          <Button variant="outline-secondary" className="social-btn">
            <Image src={Google} alt="Google" width={20} height={20} />
            <span className="mx-2">Google</span>
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default Login;
