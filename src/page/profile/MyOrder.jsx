import { Button, Table } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { checkLoginToken } from "../../utils";

export default function MyOrder() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

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
        throw new Error(t('profile.orders.noOrders'));
      }

      const result = await response.json();
      const formattedData = result.map((item) => ({
        id: item.id,
        description: item.description,
        status: t('profile.orders.status'),
      }));

      setData(formattedData);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      title: t('profile.orders.orderNumber'),
      dataIndex: "id",
      key: "id",
    },
    {
      title: t('profile.orders.description'),
      dataIndex: "description",
      key: "description",
    },
    {
      title: t('profile.orders.status'),
      dataIndex: "status",
      key: "status",
    },
    {
      title: t('profile.orders.action'),
      key: "action",
      render: (record) => (
        <Button
          type="primary"
          onClick={() => handleAction(record.id)}
          className="bg-blue-500 hover:bg-blue-600"
        >
          {t('profile.orders.details')}
        </Button>
      ),
    },
  ];

  const handleAction = (id) => {
    navigate(`/ticket-detail/${id}`);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">{t('profile.orders.title')}</h2>
      <Table
        dataSource={data}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 5 }}
        locale={{
          emptyText: t('profile.orders.noOrders')
        }}
      />
    </div>
  );
}
