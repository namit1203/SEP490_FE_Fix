import React, { useEffect, useState } from "react";
import { Table, Button, message } from "antd";
import axios from "axios";

const UpdateTicket = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRyaXZlcjFAZ21haWwuY29tIiwiSUQiOiIxIiwicm9sZSI6IkRyaXZlciIsIm5iZiI6MTczMjY5NTk0NywiZXhwIjoxNzMyNjk3NzQ3LCJpYXQiOjE3MzI2OTU5NDcsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6NzEyNCIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMyJ9.N0xdwp4G5TdJjyfHKvsxy4NrYd_A3qaSJk8cfoUWFJA";

  // Fetch danh sách vé chưa thanh toán
  const fetchUnpaidTickets = async () => {
    try {
      const response = await axios.get(
        "https://boring-wiles.202-92-7-204.plesk.page/api/Ticket/tickeNotPaid/2",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching unpaid tickets:", error);
      message.error("Failed to fetch unpaid tickets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnpaidTickets();
  }, []);

  // Xác nhận đã thu tiền
  const confirmPayment = async (ticketId) => {
    try {
      await axios.post(
        `https://boring-wiles.202-92-7-204.plesk.page/api/Ticket/confirm-payment/${ticketId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      message.success(`Payment for Ticket ID: ${ticketId} confirmed.`);
      fetchUnpaidTickets(); // Refresh danh sách sau khi xác nhận
    } catch (error) {
      console.error(`Error confirming payment for Ticket ID: ${ticketId}`, error);
      message.error("Failed to confirm payment.");
    }
  };

  // Cột của bảng
  const columns = [
    {
      title: "Number License Plate",
      dataIndex: "licensePlate",
      key: "licensePlate",
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price.toLocaleString("vi-VN")} VND`, // Định dạng tiền VND
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => confirmPayment(record.ticketId)}
          disabled={loading}
        >
          Confirm Payment
        </Button>
      ),
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
        Update Ticket - Confirm Payment
      </h2>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="ticketId"
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default UpdateTicket;
