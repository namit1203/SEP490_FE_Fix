import React, { useEffect, useState } from "react";
import { Table, Button } from "antd";
import axios from "axios";
import { checkLoginToken } from "../../utils";

export default function MyPromotion() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch promotion data
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://boring-wiles.202-92-7-204.plesk.page/api/Promotion/getPromotionById",
        {
          headers: {
            Authorization: "Bearer " + checkLoginToken(),
          },
        }
      );

      const currentDate = new Date();

      // Format API response for table
      const formattedData = response.data.map((item, index) => {
        const endDate = new Date(item.endDate);
        const daysLeft = Math.ceil((endDate - currentDate) / (1000 * 60 * 60 * 24));

        return {
          key: index,
          id: item.id,
          codePromotion: item.codePromotion,
          description: item.description,
          discount: `${item.discount}%`,
          endDate: daysLeft > 0 ? `Còn ${daysLeft} ngày` : "Đã hết hạn",
        };
      });

      setData(formattedData);
    } catch (error) {
      console.error("Error fetching promotions:", error);
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
      title: "Code",
      dataIndex: "codePromotion",
      key: "codePromotion",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
    },
  ];

  return (
    <div>
      <p className="text-xl font-bold">Khuyến mãi của tôi</p>
      <Table
        dataSource={data}
        columns={columns}
        loading={loading}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
}
