import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import EmailSignup from "./EmailSignup";
import PhoneSignup from "./PhoneSignup";
import EmailLogin from "./EmailLogin";
import PhoneLogin from "./PhoneLogin";

type AuthMethod = 'google' | 'facebook' | 'email' | 'phone';
type AuthMode = 'signup' | 'login';

const AuthPopup = () => {
  const [show, setShow] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('signup');
  const [selectedMethod, setSelectedMethod] = useState<AuthMethod | null>(null);

  const handleClose = () => {
    setShow(false);
    setSelectedMethod(null);
    setAuthMode('signup');
  };

  const handleShow = () => setShow(true);
  const switchToSignup = () => setAuthMode('signup');
  const switchToLogin = () => setAuthMode('login');

  const handleMethodSelect = (method: AuthMethod) => {
    setSelectedMethod(method);
  };

  const handleBack = () => {
    setSelectedMethod(null);
  };

  return (
    <>
      <button 
        onClick={handleShow}
        className="text-black hover:text-blue-600 hover:underline font-medium text-sm"
      >
        Login
      </button>

      <Modal 
        show={show} 
        onHide={handleClose} 
        centered 
        className="auth-modal"
        backdrop="static"
      >
        <Modal.Body className="p-4 relative">
          {/* Close button positioned absolutely within Modal.Body */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 z-10"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {!selectedMethod ? (
            <div className="text-center">
              <h3 className="text-xl font-bold mb-4">
                {authMode === 'signup' ? 'Create New Account' : 'Welcome Back'}
              </h3>
              
              <div className="space-y-3 mb-4">
                 <button
                  onClick={() => handleMethodSelect('email')}
                  className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  ✉️
                  {authMode === 'signup' ? 'Join with Email' : 'Login with Email'}
                </button>
                
                <button
                  onClick={() => handleMethodSelect('phone')}
                  className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  📱
                  {authMode === 'signup' ? 'Join with Phone' : 'Login with Phone'}
                </button>

                <p>OR</p>
                <button
                  onClick={() => handleMethodSelect('google')}
                  className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.786-1.666-4.145-2.682-6.735-2.682-5.522 0-10 4.477-10 10s4.478 10 10 10c8.396 0 10-7.524 10-10 0-0.61-0.054-1.219-0.157-1.816h-9.843z"
                      fill="#4285F4"
                    />
                  </svg>
                  {authMode === 'signup' ? 'Join with Google' : 'Login with Google'}
                </button>
                
                <button
                  onClick={() => handleMethodSelect('facebook')}
                  className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                  {authMode === 'signup' ? 'Join with Facebook' : 'Login with Facebook'}
                </button>
                
               
              </div>

              <div className="text-center text-sm text-gray-600">
                {authMode === 'signup' ? (
                  <p>
                    Already have an account?{' '}
                    <button 
                      onClick={switchToLogin}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Login
                    </button>
                  </p>
                ) : (
                  <p>
                    Don't have an account?{' '}
                    <button 
                      onClick={switchToSignup}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Sign Up
                    </button>
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div>
              <button 
                onClick={handleBack}
                className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back
              </button>

              {authMode === 'signup' ? (
                <>
                  {selectedMethod === 'email' && <EmailSignup onSuccess={handleClose} />}
                  {selectedMethod === 'phone' && <PhoneSignup onSuccess={handleClose} />}
                  {(selectedMethod === 'google' || selectedMethod === 'facebook') && (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                      <p>Redirecting to {selectedMethod === 'google' ? 'Google' : 'Facebook'} authentication...</p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {selectedMethod === 'email' && <EmailLogin onSuccess={handleClose} />}
                  {selectedMethod === 'phone' && <PhoneLogin onSuccess={handleClose} />}
                  {(selectedMethod === 'google' || selectedMethod === 'facebook') && (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                      <p>Redirecting to {selectedMethod === 'google' ? 'Google' : 'Facebook'} authentication...</p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AuthPopup;