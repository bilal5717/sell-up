import React, { useState, useEffect } from "react";
import { Form, InputGroup, Button } from "react-bootstrap";
import { FaEye, FaEyeSlash, FaFacebook } from "react-icons/fa";
import Image from "next/image";
import Google from '@/public/images/socialicons/search.png';
import axios from 'axios';
import { useRouter } from 'next/router';

type FormControlElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

type SignupProps = {
  loginMethod: "phone" | "email";
  setLoginMethod: (method: "phone" | "email") => void;
  switchToLogin: () => void;
};

const Signup: React.FC<SignupProps> = ({
  loginMethod,
  setLoginMethod,
  switchToLogin,
}) => {
  const router = useRouter();
  
  // Form states
  const [phoneSignup, setPhoneSignup] = useState({
    phone: "",
    password: "",
    confirmPassword: "",
    name: "",
  });
  
  const [emailSignup, setEmailSignup] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    verification_code: "",
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [showResend, setShowResend] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [otpStatus, setOtpStatus] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [emailExists, setEmailExists] = useState<boolean | null>(null);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [phoneExists, setPhoneExists] = useState<boolean | null>(null);
  const [otpVerifiedPhone, setOtpVerifiedPhone] = useState(false);
  const [otpStatusPhone, setOtpStatusPhone] = useState('');
  const [otpMethod, setOtpMethod] = useState<"whatsapp" | "sms">("whatsapp");

  useEffect(() => {
    if (secondsLeft > 0) {
      const timer = setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setShowResend(true);
    }
  }, [secondsLeft]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const startTimer = () => {
    setShowResend(false);
    setSecondsLeft(40);
  };

  const handleMethodChange = (method: "phone" | "email") => {
    setLoginMethod(method);
    setErrors({});
    setSuccessMessage('');
    setOtpStatus('');
    setOtpStatusPhone('');
    setShowOtpVerification(false);
    setOtpVerified(false);
    setOtpVerifiedPhone(false);
  };

  const checkEmailExists = async () => {
    if (!validateEmail(emailSignup.email)) {
      setErrors({ ...errors, email: ['Please enter a valid email address'] });
      return;
    }
  
    try {
      setCheckingEmail(true);
      const res = await axios.post('http://127.0.0.1:8000/api/check-email', {
        email: emailSignup.email,
      });
  
      setEmailExists(res.data.exists);
      if (res.data.exists) {
        setErrors({ ...errors, email: ['This email already exists'] });
      } else {
        const newErrors = { ...errors };
        delete newErrors.email;
        setErrors(newErrors);
      }
    } catch (err) {
      console.error("Email check failed:", err);
      setEmailExists(null);
      setErrors({ ...errors, email: ['Error checking email'] });
    } finally {
      setCheckingEmail(false);
    }
  };

  const checkPhoneExists = async (): Promise<boolean> => {
    if (!phoneSignup.phone) {
      setErrors({ ...errors, phone: ['Phone number is required'] });
      return true;
    }

    if (phoneSignup.phone.length < 9 || phoneSignup.phone.length > 10) {
      setErrors({ ...errors, phone: ['Please enter a valid Pakistani phone number'] });
      return true;
    }

    const formattedPhone = `+92${phoneSignup.phone.replace(/^0+/, '')}`;
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/check-phone', { phone: formattedPhone });
      if (res.data.exists) {
        setErrors(prev => ({ ...prev, phone: ['Phone number already exists'] }));
        setPhoneExists(true);
        return true;
      }else {
        setPhoneExists(false);
        return false;
      }
    } catch (error) {
      setErrors({ ...errors, phone: ['Error checking phone number'] });
      return true;
    }
  };

  const handleGetCode = async () => {
    if (!validateEmail(emailSignup.email)) {
      setErrors({ ...errors, email: ['Please enter a valid email address'] });
      return;
    }
  
    try {
      setLoading(true);
      setSuccessMessage('');
  
      const response = await axios.post('http://127.0.0.1:8000/api/send-verification-code', {
        email: emailSignup.email,
      });
  
      if (response.data.success) {
        startTimer();
        setErrors({});
        setSuccessMessage('✅ OTP code sent successfully to your email.');
  
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
      } else {
        setErrors(response.data.errors || { general: ['Failed to send OTP'] });
        setSuccessMessage('');
      }
  
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      setErrors(error.response?.data?.errors || { general: ['Server error. Please try again.'] });
      setSuccessMessage('');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const { email, verification_code } = emailSignup;
  
    if (!email || !verification_code || verification_code.length !== 4) {
      setErrors({ ...errors, verification_code: ['Please enter a valid 4-digit code'] });
      return;
    }
  
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/verify-email-otp', {
        email,
        otp: verification_code,
      });
  
      if (res.data.success) {
        setOtpStatus('✅ ' + res.data.message);
        setOtpVerified(true);
        setSecondsLeft(0);
        setShowResend(false);
        setErrors({});
      } else {
        setOtpStatus('❌ ' + res.data.message);
        setErrors({ verification_code: [res.data.message] });
      }
    } catch (err) {
      console.error('OTP Verify Error:', err);
      setOtpStatus('❌ Something went wrong while verifying.');
      setErrors({ verification_code: ['Verification failed'] });
    }
  
    setTimeout(() => setOtpStatus(''), 5000);
  };

  const handleSendWhatsAppOtp = async () => {
    setOtpMethod("whatsapp");
    const exists = await checkPhoneExists();
    if (exists) return;

    const formattedPhone = `+92${phoneSignup.phone.replace(/^0+/, '')}`;
  
    try {
      setLoading(true);
      const response = await axios.post('http://127.0.0.1:8000/api/send-whatsapp-otp', {
        phone: formattedPhone,
      });
  
      if (response.data.success) {
        setShowOtpVerification(true);
        setOtpStatusPhone('✅ OTP sent successfully via WhatsApp');
        startTimer();
        setTimeout(() => setOtpStatusPhone(''), 5000);
      } else {
        setErrors({ ...errors, phone: [response.data.message] });
      }
    } catch (error) {
      setErrors({ ...errors, phone: ['Failed to send WhatsApp OTP'] });
    } finally {
      setLoading(false);
    }
  };

  const handleSendSMSOtp = async () => {
    setOtpMethod("sms");
    const exists = await checkPhoneExists();
    if (exists) return;

    const formattedPhone = `+92${phoneSignup.phone.replace(/^0+/, '')}`;
  
    try {
      setLoading(true);
      const response = await axios.post('http://127.0.0.1:8000/api/send-sms-otp', {
        phone: formattedPhone,
      });
  
      if (response.data.success) {
        setShowOtpVerification(true);
        setOtpStatusPhone('✅ OTP sent successfully via SMS');
        startTimer();
        setTimeout(() => setOtpStatusPhone(''), 5000);
      } else {
        setErrors({ ...errors, phone: [response.data.message] });
      }
    } catch (error) {
      setErrors({ ...errors, phone: ['Failed to send SMS OTP'] });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPhoneOtp = async () => {
    const formattedPhone = `+92${phoneSignup.phone.replace(/^0+/, '')}`;
    const enteredOtp = otp.join('');
    
    if (enteredOtp.length !== 4) {
      setErrors({ ...errors, otp: ['Please enter a valid 4-digit OTP'] });
      return;
    }

    try {
      const res = await axios.post('http://127.0.0.1:8000/api/verify-phone-otp', {
        phone: formattedPhone,
        otp: enteredOtp,
      });
  
      if (res.data.success) {
        setOtpStatusPhone('✅ ' + res.data.message);
        setOtpVerifiedPhone(true);
        setSecondsLeft(0);
        setShowResend(false);
        setErrors({});
      } else {
        setOtpStatusPhone('❌ ' + res.data.message);
        setErrors({ otp: [res.data.message] });
      }
    } catch (err) {
      setOtpStatusPhone('❌ Server error while verifying OTP');
      setErrors({ otp: ['Verification failed'] });
    }
  
    setTimeout(() => setOtpStatusPhone(''), 5000);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      if (value && index < 3) {
        const nextInput = document.getElementById(`otp-input-${index + 1}`) as HTMLInputElement;
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<FormControlElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`) as HTMLInputElement;
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
  
    // Validate name
    if (!emailSignup.name.trim()) {
      setErrors({ ...errors, name: ['Full name is required'] });
      return;
    }
  
    // Validate passwords match
    if (emailSignup.password !== emailSignup.confirmPassword) {
      setErrors({ ...errors, confirmPassword: ['Passwords do not match'] });
      return;
    }
  
    // Validate password strength
    if (emailSignup.password.length < 8) {
      setErrors({ ...errors, password: ['Password must be at least 8 characters'] });
      return;
    }
  
    try {
      setLoading(true);
  
      const response = await axios.post('http://127.0.0.1:8000/api/register', {
        name: emailSignup.name,
        email: emailSignup.email,
        password: emailSignup.password,
        password_confirmation: emailSignup.confirmPassword,
        verification_code: emailSignup.verification_code,
      });
  
      if (response.data.success) {
        if (typeof switchToLogin === 'function') {
          switchToLogin();
        } else {
          router.push('/');
        }
      } else {
        setErrors(response.data.errors || {});
      }
    } catch (error: any) {
      setErrors(error.response?.data?.errors || { general: ['Registration failed'] });
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
  
    // Validate name
    if (!phoneSignup.name.trim()) {
      setErrors({...errors, name: ['Full name is required']});
      return;
    }
  
    if (phoneSignup.password !== phoneSignup.confirmPassword) {
      setErrors({...errors, confirmPassword: ['Passwords do not match']});
      return;
    }
  
    if (phoneSignup.password.length < 8) {
      setErrors({...errors, password: ['Password must be at least 8 characters']});
      return;
    }
  
    try {
      setLoading(true);
      const formattedPhone = `+92${phoneSignup.phone.replace(/^0+/, '')}`;
      
      const response = await axios.post('http://127.0.0.1:8000/api/register-phone', {
        name: phoneSignup.name,
        phone: formattedPhone,
        password: phoneSignup.password,
        password_confirmation: phoneSignup.confirmPassword
      });

      if (response.data.success) {
        router.push('/dashboard');
      } else {
        setErrors(response.data.errors || {});
      }
    } catch (error: any) {
      setErrors(error.response?.data?.errors || { general: ['Registration failed'] });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (loginMethod === "email") {
      handleEmailSignup(e);
    } else if (loginMethod === "phone" && showOtpVerification) {
      e.preventDefault();
      handleVerifyPhoneOtp();
    } else if (loginMethod === "phone") {
      e.preventDefault();
      // Don't submit, handled by individual OTP methods
    }
  };

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <div className="mb-0">
        <div className="d-flex justify-content-center mb-3">
          <div className="btn-group" role="group">
            <button
              type="button"
              className={`btn ${loginMethod === "email" ? "btn-danger" : "btn-outline-secondary"}`}
              onClick={() => handleMethodChange("email")}
            >
              Email
            </button>
            <button
              type="button"
              className={`btn ${loginMethod === "phone" ? "btn-danger" : "btn-outline-secondary"}`}
              onClick={() => handleMethodChange("phone")}
            >
              Phone
            </button>
          </div>
        </div>
      </div>

      {loginMethod === "email" ? (
        <>
          <Form.Group className="mb-3">
            <Form.Control
              type="email"
              placeholder="Email Address"
              className="form-control daraz-input"
              value={emailSignup.email}
              onChange={(e) => {
                setEmailSignup({ ...emailSignup, email: e.target.value });
                setEmailExists(null);
              }}
              onBlur={checkEmailExists}
              isInvalid={!!errors.email || emailExists === true}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email?.[0] || (emailExists === true && "This email already exists")}
            </Form.Control.Feedback>
            {checkingEmail && (
              <div className="small text-muted mt-1">Checking email availability...</div>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <InputGroup>
              <Form.Control
                type="number"
                placeholder="Verification Code"
                className="form-control daraz-input"
                value={emailSignup.verification_code}
                onChange={(e) =>
                  setEmailSignup({ ...emailSignup, verification_code: e.target.value })
                }
                onBlur={handleVerifyOtp}
                isInvalid={!!errors.verification_code}
                disabled={otpVerified}
              />
              <Button
                className="border-none w-35"
                style={{
                  backgroundColor: '#c5ccd4',
                  color: '#212529',
                  border: 'none',
                }}
                onClick={handleGetCode}
                disabled={
                  !validateEmail(emailSignup.email) ||
                  secondsLeft > 0 ||
                  loading ||
                  emailExists !== false ||
                  otpVerified
                }
              >
                {loading ? 'Sending...' : secondsLeft > 0 ? `Resend in ${secondsLeft}s` : 'Get Code'}
              </Button>
            </InputGroup>

            <Form.Control.Feedback type="invalid">
              {errors.verification_code?.[0]}
            </Form.Control.Feedback>

            {successMessage && (
              <div className="small text-success mt-1">
                {successMessage}
              </div>
            )}

            {otpStatus && (
              <div className={`small mt-1 ${otpStatus.includes('✅') ? 'text-success' : 'text-danger'}`}>
                {otpStatus}
              </div>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Full Name"
              className="form-control daraz-input"
              value={emailSignup.name}
              onChange={(e) => setEmailSignup({ ...emailSignup, name: e.target.value })}
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name?.[0]}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <InputGroup>
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="form-control daraz-input"
                value={emailSignup.password}
                onChange={(e) => setEmailSignup({ ...emailSignup, password: e.target.value })}
                isInvalid={!!errors.password}
                disabled={!otpVerified}
              />
              <InputGroup.Text
                onClick={togglePasswordVisibility}
                className="password-toggle"
                style={{ cursor: "pointer" }}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </InputGroup.Text>
            </InputGroup>
            <Form.Control.Feedback type="invalid">
              {errors.password?.[0]}
            </Form.Control.Feedback>
            <div className="small text-muted mt-1">
              Password must be at least 8 characters
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <InputGroup>
              <Form.Control
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="form-control daraz-input"
                value={emailSignup.confirmPassword}
                onChange={(e) => setEmailSignup({ ...emailSignup, confirmPassword: e.target.value })}
                isInvalid={!!errors.confirmPassword}
                disabled={!otpVerified}
              />
              <InputGroup.Text
                onClick={toggleConfirmPasswordVisibility}
                className="password-toggle"
                style={{ cursor: "pointer" }}
              >
                {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
              </InputGroup.Text>
            </InputGroup>
            <Form.Control.Feedback type="invalid">
              {errors.confirmPassword?.[0]}
            </Form.Control.Feedback>
          </Form.Group>

          <Button 
            variant="danger" 
            type="submit" 
            className="w-100 mb-3 daraz-primary-btn"
            disabled={loading || !otpVerified}
          >
            {loading ? 'Signing Up...' : 'Signup'}
          </Button>
        </>
      ) : (
        <>
          {!showOtpVerification ? (
            <>
              <Form.Group className="mb-3 d-flex align-items-center">
                <div className="input-group">
                  <span className="input-group-text" style={{ padding: '0.375rem 0.75rem' }}>
                    <img 
                      src="https://flagcdn.com/w20/pk.png" 
                      alt="Pakistan" 
                      style={{ width: '24px', marginRight: '8px' }} 
                    />
                    <span className="mx-0 mt-1">+92</span>
                  </span>
                  <Form.Control
                    type="tel"
                    placeholder="Phone Number"
                    className="form-control daraz-input"
                    value={phoneSignup.phone}
                    onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, '');
                        const trimmed = raw.startsWith('0') ? raw.slice(1) : raw;
                        setPhoneSignup({ ...phoneSignup, phone: trimmed });
                      }}
                    style={{ paddingLeft: '15px', paddingTop: '15px' }}
                    isInvalid={!!errors.phone}
                  />
                </div>
                <Form.Control.Feedback type="invalid">
  {errors.phone?.[0]}
</Form.Control.Feedback>
              
              </Form.Group>
              
              {otpStatusPhone && (
                <div className={`small mb-3 ${otpStatusPhone.includes('✅') ? 'text-success' : 'text-danger'}`}>
                  {otpStatusPhone}
                </div>
              )}

              <Button 
                className="w-100 mb-3 btn-success"
                onClick={handleSendWhatsAppOtp}
                disabled={loading || !phoneSignup.phone || phoneExists === true}
              >
                {loading ? 'Sending...' : 'Send OTP Code Via WhatsApp'}
              </Button>
              
              <Button 
                className="w-100 mb-3 bg-white text-dark border-dark"
                onClick={handleSendSMSOtp}
                disabled={loading || !phoneSignup.phone || phoneExists === true}
              >
                {loading ? 'Sending...' : 'Send OTP Code Via SMS'}
              </Button>
            </>
          ) : (
            <>
              <div className="mb-3">
                <p className="small text-muted">
                  We've sent a 4-digit OTP to your {otpMethod === 'whatsapp' ? 'WhatsApp' : 'SMS'} 
                  at +92{phoneSignup.phone}
                </p>
              </div>

              <div className="d-flex justify-content-between mb-4">
                {[0, 1, 2, 3].map((index) => (
                  <React.Fragment key={index}>
                    <Form.Control
                      id={`otp-input-${index}`}
                      type="text"
                      as="input"
                      className="form-control daraz-input text-center mx-2"
                      style={{
                        width: '70px',
                        height: '70px',
                        fontSize: '1.5rem',
                        padding: '0'
                      }}
                      value={otp[index]}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      maxLength={1}
                      isInvalid={!!errors.otp}
                    />
                    {index < 3 && <span className="d-flex align-items-center">-</span>}
                  </React.Fragment>
                ))}
              </div>
              <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>
                {errors.otp?.[0]}
              </Form.Control.Feedback>

              <Button 
                variant="danger" 
                className="w-100 mb-3 daraz-primary-btn"
                onClick={handleVerifyPhoneOtp}
                disabled={otp.some(digit => digit === "") || loading}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </Button>

              <div className="text-center mb-3">
                <p className="small">
                  Didn't receive code?{' '}
                  {showResend ? (
                    <span 
                      className="text-danger cursor-pointer" 
                      onClick={() => {
                        setShowOtpVerification(false);
                        otpMethod === 'whatsapp' ? handleSendWhatsAppOtp() : handleSendSMSOtp();
                      }}
                    >
                      Resend
                    </span>
                  ) : (
                    <span className="text-muted">
                      Resend code in {secondsLeft} seconds
                    </span>
                  )}
                </p>
              </div>

              {otpStatusPhone && (
                <div className={`small text-center mb-3 ${otpStatusPhone.includes('✅') ? 'text-success' : 'text-danger'}`}>
                  {otpStatusPhone}
                </div>
              )}

              {otpVerifiedPhone && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Full Name"
                      className="form-control daraz-input"
                      value={phoneSignup.name}
                      onChange={(e) => setPhoneSignup({...phoneSignup, name: e.target.value})}
                      isInvalid={!!errors.name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.name?.[0]}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <InputGroup>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className="form-control daraz-input"
                        value={phoneSignup.password}
                        onChange={(e) => setPhoneSignup({...phoneSignup, password: e.target.value})}
                        isInvalid={!!errors.password}
                      />
                      <InputGroup.Text 
                        className="password-toggle"
                        onClick={togglePasswordVisibility}
                        style={{ cursor: "pointer" }}
                      >
                        {showPassword ? <FaEye /> : <FaEyeSlash />}
                      </InputGroup.Text>
                    </InputGroup>
                    <Form.Control.Feedback type="invalid">
                      {errors.password?.[0]}
                    </Form.Control.Feedback>
                    <div className="small text-muted mt-1">
                      Password must be at least 8 characters
                    </div>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <InputGroup>
                      <Form.Control
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        className="form-control daraz-input"
                        value={phoneSignup.confirmPassword}
                        onChange={(e) => setPhoneSignup({...phoneSignup, confirmPassword: e.target.value})}
                        isInvalid={!!errors.confirmPassword}
                      />
                      <InputGroup.Text 
                        className="password-toggle"
                        onClick={toggleConfirmPasswordVisibility}
                        style={{ cursor: "pointer" }}
                      >
                        {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                      </InputGroup.Text>
                    </InputGroup>
                    <Form.Control.Feedback type="invalid">
                      {errors.confirmPassword?.[0]}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Button
                    type="button"
                    className="w-100 mb-3 btn btn-danger"
                    onClick={handlePhoneSignup}
                    disabled={
                      loading || 
                      !phoneSignup.password || 
                      !phoneSignup.confirmPassword || 
                      phoneSignup.password !== phoneSignup.confirmPassword ||
                      phoneSignup.password.length < 8
                    }
                  >
                    {loading ? 'Completing Registration...' : 'Complete Registration'}
                  </Button>
                </>
              )}
            </>
          )}
        </>
      )}

      <div className="text-center">
        <p className="small">
          Already have an account?{" "}
          <span className="text-danger cursor-pointer" onClick={switchToLogin}>
            Login
          </span>
        </p>
      </div>

      <div className="text-center mt-4">
        <p className="divider-text small">or Signup with</p>
        <div className="d-flex justify-content-center gap-3">
          <Button variant="outline-secondary" className="social-btn d-flex align-items-center justify-content-center">
            <FaFacebook fontSize={24} color="#1877f2"/>
            <span className="mx-2 mt-1">Facebook</span>
          </Button>
          <Button variant="outline-secondary" className="social-btn w-30 text-center d-flex align-items-center justify-content-center">
            <Image 
              src={Google} 
              alt="Google" 
              width={20} 
              height={20}
              className="me-2" 
            />
            <span className="mx-0 mt-1">Google</span>
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default Signup;