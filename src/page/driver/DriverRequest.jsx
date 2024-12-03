import React, { useEffect, useState } from "react";
import { Table, Tag, message } from "antd";
import axios from "axios";

const DriverRequests = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch danh sách request
  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("driverToken");
      if (!token) {
        message.error("No token found. Please log in.");
        return;
      }

      const response = await axios.get(
        "https://boring-wiles.202-92-7-204.plesk.page/api/Request/getListRequestForDriver",
        {
          headers: { Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRyaXZlcjFAZ21haWwuY29tIiwiSUQiOiIxIiwicm9sZSI6IkRyaXZlciIsIm5iZiI6MTczMjY5MzgyOSwiZXhwIjoxNzMyNjk1NjI5LCJpYXQiOjE3MzI2OTM4MjksImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6NzEyNCIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMyJ9.Gu3UGLTSr4zHHVos0Va4V_IvPe_aCuZoCkJPGTiYxxM` },
        }
      );

      setData(response.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
      message.error("Failed to fetch requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Cột của bảng
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      render: (note) => {
        // Hiển thị màu xanh nếu note chứa "Đã xác nhận"
        const isConfirmed = note === "Đã xác nhận";
        return (
          <Tag color={isConfirmed ? "green" : "red"}>{note}</Tag>
        );
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => {
        return new Date(createdAt).toLocaleString(); // Format thời gian
      },
    },
  ];

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "auto",
        padding: "20px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Driver Requests
      </h2>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="id"
      />
    </div>
  );
};

export default DriverRequests;
