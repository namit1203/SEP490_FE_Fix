import React from "react";
import { Form, Input, Button, message } from "antd";
import axios from "axios";

const DriverLogin = () => {
  const handleLogin = async (values) => {
    try {
      const { data: token } = await axios.post(
        "https://boring-wiles.202-92-7-204.plesk.page/loginDriver",
        values
      );
      // Lưu token vào localStorage với key 'driverToken'
      localStorage.setItem("driverToken", token);
      message.success("Driver login successful!");
    } catch (error) {
      console.error("Driver login error:", error);
      message.error("Invalid username or password.");
    }
  };

  return (
    <Form layout="vertical" onFinish={handleLogin}>
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: "Please enter your username!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please enter your password!" }]}
      >
        <Input.Password />
      </Form.Item>
      <Button type="primary" htmlType="submit">
        Login
      </Button>
    </Form>
  );
};

export default DriverLogin;
