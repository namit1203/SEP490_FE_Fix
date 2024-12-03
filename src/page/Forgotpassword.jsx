import React, { useState } from "react";
import axios from "axios";
import { message } from "antd";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Request token, 2: Reset password
  const [email, setEmail] = useState("");
  const [resetData, setResetData] = useState({
    code: "",
    password: "",
    confirmPassword: "",
  });

  const handleRequestToken = async () => {
    try {
      await axios.post("https://boring-wiles.202-92-7-204.plesk.page/api/Auth/ForgotPassword", {
        email,
      });
      message.success("Mã xác nhận đã được gửi qua email của bạn!");
      setStep(2); // Chuyển sang bước đặt lại mật khẩu
    } catch (error) {
      console.error("Error requesting token:", error);
      message.error("Không thể gửi mã xác nhận, vui lòng thử lại.");
    }
  };

  const handleResetPassword = async () => {
    const { code, password, confirmPassword } = resetData;

    if (password !== confirmPassword) {
      message.error("Mật khẩu và xác nhận mật khẩu không khớp.");
      return;
    }

    try {
      await axios.post("https://boring-wiles.202-92-7-204.plesk.page/api/Auth/ResetPassword", {
        email,
        code,
        password,
        confirmPassword,
      });
      message.success("Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.");
      setStep(1); // Quay lại bước nhập email
      setEmail("");
      setResetData({ code: "", password: "", confirmPassword: "" });
    } catch (error) {
      console.error("Error resetting password:", error);
      message.error("Đặt lại mật khẩu thất bại, vui lòng kiểm tra thông tin.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        {step === 1 && (
          <div>
            <h2 style={styles.title}>Quên mật khẩu</h2>
            <p style={styles.description}>Vui lòng nhập email để nhận mã xác nhận.</p>
            <input
              type="email"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
            <button onClick={handleRequestToken} style={styles.button}>
              Gửi mã xác nhận
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={styles.title}>Đặt lại mật khẩu</h2>
            <p style={styles.description}>Nhập mã xác nhận và mật khẩu mới của bạn.</p>
            <input
              type="text"
              placeholder="Nhập mã xác nhận"
              value={resetData.code}
              onChange={(e) =>
                setResetData({ ...resetData, code: e.target.value })
              }
              style={styles.input}
            />
            <input
              type="password"
              placeholder="Nhập mật khẩu mới"
              value={resetData.password}
              onChange={(e) =>
                setResetData({ ...resetData, password: e.target.value })
              }
              style={styles.input}
            />
            <input
              type="password"
              placeholder="Xác nhận mật khẩu mới"
              value={resetData.confirmPassword}
              onChange={(e) =>
                setResetData({ ...resetData, confirmPassword: e.target.value })
              }
              style={styles.input}
            />
            <button onClick={handleResetPassword} style={styles.button}>
              Đặt lại mật khẩu
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f9fafb",
  },
  box: {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
  },
  title: {
    fontSize: "1.5rem",
    marginBottom: "1rem",
    color: "#333",
  },
  description: {
    marginBottom: "1rem",
    color: "#666",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    border: "1px solid #d1d5db",
    borderRadius: "4px",
    fontSize: "16px",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    cursor: "pointer",
  },
  buttonHover: {
    backgroundColor: "#1d4ed8",
  },
};

export default ForgotPassword;
