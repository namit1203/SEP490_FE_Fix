import { Button, Table, Modal, Input, message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { checkLoginToken } from "../../utils";

export default function MyOrder() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [reasonCancel, setReasonCancel] = useState("");
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
        status: item.status,
        timeFrom: item.timeFrom, // Add timeFrom to the data
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      title: t('profile.orders.timeFrom'),
      dataIndex: "timeFrom",
      key: "timeFrom",
      render: (text) => new Date(text).toLocaleDateString(), // Chỉ hiển thị ngày
    },
    
    {
      title: t('profile.orders.action'),
      key: "action",
      render: (record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            type="primary"
            onClick={() => handleAction(record.id)}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {t('profile.orders.details')}
          </Button>
          {record.status !== "Hủy chuyến" && record.status !== "Chờ xác nhận hủy chuyến từ hệ thống" && record.status !== "Hủy vé" && (
            <Button
              danger
              onClick={() => handleCancel(record)}
            >
              {t('profile.orders.cancel')}
            </Button>
          )}
        </div>
      ),
    },
  ];
  

  const handleAction = (id) => {
    navigate(`/ticket-detail/${id}`);
  };

  const handleCancel = (ticket) => {
    const now = new Date();
    const timeFrom = new Date(ticket.timeFrom);

    // Validate timeFrom must be at least 1 day in future
    const oneDayBefore = new Date(timeFrom);
    oneDayBefore.setDate(timeFrom.getDate() - 1);

    if (now > oneDayBefore) {
      message.error(t("profile.orders.cancelTooLate"));
      return;
    }

    setSelectedTicket(ticket);
    setCancelModalVisible(true);
  };

  const handleCancelSubmit = async () => {
    if (!reasonCancel.trim()) {
      message.error(t("profile.orders.cancelReasonRequired"));
      return;
    }

    try {
      const response = await fetch(
        "https://boring-wiles.202-92-7-204.plesk.page/api/UserCancleTicket/userCancleTicket",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + checkLoginToken(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reasonCancle: reasonCancel,
            ticketId: selectedTicket.id,
          }),
        }
      );

      if (response.ok) {
        message.success(t("profile.orders.cancelSuccess"));
        fetchData(); // Refresh the table
      } else {
        message.error(t("profile.orders.cancelFailed"));
      }
    } catch (error) {
      console.error("Error canceling ticket:", error);
      message.error(t("profile.orders.cancelFailed"));
    } finally {
      setCancelModalVisible(false);
      setReasonCancel("");
    }
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

      {/* Cancel Modal */}
      <Modal
        visible={cancelModalVisible}
        title={t("profile.orders.cancelTicket")}
        onCancel={() => setCancelModalVisible(false)}
        onOk={handleCancelSubmit}
        okText={t("profile.orders.confirmCancel")}
        cancelText={t("profile.orders.cancelClose")}
      >
        <p>{t("profile.orders.cancelReasonLabel")}</p>
        <Input.TextArea
          rows={4}
          value={reasonCancel}
          onChange={(e) => setReasonCancel(e.target.value)}
          placeholder={t("profile.orders.cancelReasonPlaceholder")}
        />
      </Modal>
    </div>
  );
}
