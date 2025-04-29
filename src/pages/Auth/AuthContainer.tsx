import React, { useState } from "react";
import { Modal, Tab } from "react-bootstrap";
import Login from "./Login";
import Signup from "./Signup";

const AuthPopup = () => {
  const [show, setShow] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [loginMethod, setLoginMethod] = useState<"phone" | "email">("phone");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const switchToSignup = () => setActiveTab("signup");
  const switchToLogin = () => setActiveTab("login");

  const handleLoginSubmit = (e: React.FormEvent, method: "phone" | "email") => {
    e.preventDefault();
    console.log(`Login with ${method}`);
    handleClose();
  };

  return (
    <>
      <button className="flex items-center space-x-1" onClick={handleShow}>
        <strong className="text-decoration-underline">Login</strong>
      </button>

      <Modal show={show} onHide={handleClose} centered className="daraz-auth-modal" backdrop="static">
        <Modal.Header closeButton className="modal-header border-0 pb-0" />
        <Modal.Body className="modal-body pt-0">
          <Tab.Container activeKey={activeTab}>
            <Tab.Content className="mt-3 tab-content">
              <Tab.Pane eventKey="login">
                <Login
                  loginMethod={loginMethod}
                  setLoginMethod={setLoginMethod}
                  switchToSignup={switchToSignup}
                  handleLoginSubmit={handleLoginSubmit}
                />
              </Tab.Pane>

              <Tab.Pane eventKey="signup">
                <Signup
                  loginMethod={loginMethod}
                  setLoginMethod={setLoginMethod}
                  switchToLogin={switchToLogin}
                />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AuthPopup;
