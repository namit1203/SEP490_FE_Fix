import { Button, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkLoginToken } from "../../utils";

export default function MyOrder() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://boring-wiles.202-92-7-204.plesk.page/api/Ticket/listTicketByUserId",
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + checkLoginToken(),
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = await response.json();

      // Map API response to table's data structure
      const formattedData = result.map((item, index) => ({
        id: index + 1, // Sequential ID
        description: item.description,
        note: "Chờ xác nhận", // Assuming note is static as per your example
      }));

      setData(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
    },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <Button
          type="primary"
          onClick={() => handleAction(record.id)}
          htmlType="button"
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  const handleAction = (id) => {
    // Navigate to the ticket-detail page with the selected ID
    navigate(`/ticket-detail/${id}`);
  };

  return (
    <>
      <p className="text-xl font-bold">Đơn hàng của tôi</p>
      <Table
        dataSource={data}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 5 }}
      />
    </>
  );
}
