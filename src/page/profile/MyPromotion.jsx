import { useEffect, useState } from "react";
import { Table, Button } from "antd";
import axios from "axios";
import { useTranslation } from 'react-i18next';
import { checkLoginToken } from "../../utils";

export default function MyPromotion() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

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
  
      const currentDate = new Date(); // Ngày hiện tại
      const formattedData = response.data.map((item, index) => {
        const endDate = new Date(item.endDate); // Ngày kết thúc
        const isExpired = endDate < currentDate; // Kiểm tra đã hết hạn
  
        return {
          key: index,
          id: item.id,
          code: item.codePromotion,
          description: item.description,
          discount: `${item.discount}%`,
          endDate: endDate.toLocaleDateString(), // Hiển thị ngày hết hạn
          status: isExpired ? 'expired' : 'active', // Trạng thái
        };
      });
  
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
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: t('profile.promotions.code'),
      dataIndex: "code",
      key: "code",
    },
    {
      title: t('profile.promotions.description'),
      dataIndex: "description",
      key: "description",
    },
    {
      title: t('profile.promotions.discount'),
      dataIndex: "discount",
      key: "discount",
    },
    {
      title: t('profile.promotions.endDate'), // Tiêu đề mới
      dataIndex: "endDate",
      key: "endDate",
      render: (text, record) => (
        <span className={record.status === 'expired' ? 'text-red-500' : 'text-green-500'}>
          {text}
        </span>
      ),
    },
    {
      title: t('profile.promotions.action'),
      key: "action",
      render: (_, record) => (
        record.status === 'active' && (
<Button
  type="primary"
  className="bg-blue-500 hover:bg-blue-600"
  onClick={() => {
    window.location.href = '/booking-car';
  }}
>
  {t('profile.promotions.useNow')}
</Button>

        )
      ),
    },
  ];
  
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">{t('profile.promotions.title')}</h2>
      <Table
        dataSource={data}
        columns={columns}
        loading={loading}
        pagination={{ pageSize: 5 }}
        locale={{
          emptyText: t('profile.promotions.noPromotions')
        }}
      />
    </div>
  );
}
