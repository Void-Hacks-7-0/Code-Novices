import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./loginn.module.css";

// ⭐ Firebase imports
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";

const AdminLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [loginMethod, setLoginMethod] = useState("password");

  // ⭐ Firebase Email/Password Login
  const validateLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, username, password);
      alert("Login Successful ✅");
      login("admin");
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  const sendOTP = () => {
    alert("OTP system not connected to Firebase yet");
  };

  const validateOTP = (e) => {
    e.preventDefault();
    alert("OTP login not integrated yet");
  };

  // ⭐ Firebase Google Login
  const googleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      alert("Google Login Successful 🎉");
      login("admin");
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className={styles.adminPage}>
      <div className={styles.loginContainer}>
        <div className={styles.loginBox}>
          <h2>Login</h2>

          {/* Toggle Buttons */}
          <div style={{ marginBottom: "15px" }}>
            <button
              onClick={() => setLoginMethod("password")}
              className={loginMethod === "password" ? styles.activeTab : styles.inactiveTab}
            >
              Email / Password
            </button>

            <button
              onClick={() => setLoginMethod("otp")}
              className={loginMethod === "otp" ? styles.activeTab : styles.inactiveTab}
              style={{ marginLeft: "10px" }}
            >
              OTP Login
            </button>
          </div>

          {/* Email + Password Login */}
          {loginMethod === "password" && (
            <form onSubmit={validateLogin}>
              <div className={styles.inputGroup}>
                <label>Email</label>
                <input
                  type="email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter Email"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  required
                />
              </div>

              <button type="submit" className={styles.loginButton}>Login</button>
            </form>
          )}

          {/* OTP Login */}
          {loginMethod === "otp" && (
            <form onSubmit={validateOTP}>
              <div className={styles.inputGroup}>
                <label>Mobile Number</label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  maxLength="10"
                  placeholder="Enter Mobile Number"
                  required
                />
              </div>

              <div className={styles.otpGroup}>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength="6"
                  placeholder="Enter OTP"
                />
                <button type="button" className={styles.sendOtp} onClick={sendOTP}>
                  Send OTP
                </button>
              </div>

              <button type="submit" className={styles.loginButton}>Login with OTP</button>
            </form>
          )}

          <div className={styles.divider}><span>OR</span></div>

          {/* Google Login */}
          <button className={styles.googleButton} onClick={googleLogin}>
            Login with Google
          </button>

        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
