import React, { useEffect, useState } from "react";
import { Table, Tag, message } from "antd";
import axios from "axios";

const History = () => {
  const [data, setData] = useState([]); // Dữ liệu lịch sử chuyến đi
  const [loading, setLoading] = useState(true); // Trạng thái loading

  // Hàm fetch danh sách lịch sử chuyến đi
  const fetchHistory = async () => {
    try {
      // Gọi API để lấy danh sách lịch sử chuyến đi
      const response = await axios.get(
        "https://boring-wiles.202-92-7-204.plesk.page/api/HistoryRentDriver/driver-history",
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRyaXZlcjFAZ21haWwuY29tIiwiSUQiOiIxIiwicm9sZSI6IkRyaXZlciIsIm5iZiI6MTczMjY5MzgyOSwiZXhwIjoxNzMyNjk1NjI5LCJpYXQiOjE3MzI2OTM4MjksImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6NzEyNCIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMyJ9.Gu3UGLTSr4zHHVos0Va4V_IvPe_aCuZoCkJPGTiYxxM`,
          },
        }
      );

      const historyData = response.data;

      // Lấy licensePlate từ vehicleId
      const updatedData = await Promise.all(
        historyData.map(async (history) => {
          try {
            const vehicleResponse = await axios.get(
              `https://boring-wiles.202-92-7-204.plesk.page/api/Vehicle/getInforVehicle/${history.vehicleId}`
            );
            const licensePlate = vehicleResponse.data.licensePlate;

            return {
              ...history,
              licensePlate,
            };
          } catch (error) {
            console.error(
              `Error fetching vehicle data for vehicleId ${history.vehicleId}:`,
              error
            );
            return { ...history, licensePlate: "Unknown" };
          }
        })
      );

      setData(updatedData);
    } catch (error) {
      console.error("Error fetching history data:", error);
      message.error("Failed to fetch driver history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Cột của bảng
  const columns = [
    {
      title: "History ID",
      dataIndex: "historyId",
      key: "historyId",
    },
    {
      title: "License Plate",
      dataIndex: "licensePlate",
      key: "licensePlate",
    },
    {
      title: "Start Time",
      dataIndex: "timeStart",
      key: "timeStart",
      render: (timeStart) => new Date(timeStart).toLocaleString(),
    },
    {
      title: "End Time",
      dataIndex: "endStart",
      key: "endStart",
      render: (endStart) => new Date(endStart).toLocaleString(),
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
        Driver Trip History
      </h2>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="historyId"
      />
    </div>
  );
};

export default History;
