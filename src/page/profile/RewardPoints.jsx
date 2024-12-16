import axios from "axios";
import { useEffect, useState } from "react";
import { message } from "antd"; // Import message từ Ant Design
import { useTranslation } from 'react-i18next';
import { checkLoginToken } from "../../utils";

const RewardPoints = () => {
  const [dataUser, setDataUser] = useState(null);
  const [promotions, setPromotions] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [pointHistory, setPointHistory] = useState([]);
  const { t } = useTranslation();

  const handelFetchData = async () => {
    try {
      const { data } = await axios.get(
        "https://boring-wiles.202-92-7-204.plesk.page/api/PointUser/getPointUserByUserId",
        {
          headers: {
            Authorization: "Bearer " + checkLoginToken(),
          },
        }
      );
      setDataUser(data);
    } catch (error) {
      console.error("Error fetching user points:", error);
    }
  };

  const fetchPromotions = async () => {
    try {
      const { data } = await axios.get(
        "https://boring-wiles.202-92-7-204.plesk.page/api/Promotion/listPromtionCanChange",
        {
          headers: {
            Authorization: "Bearer " + checkLoginToken(),
          },
        }
      );
      setPromotions(data);
    } catch (error) {
      console.error("Error fetching promotions:", error);
    }
  };

  const handleExchange = async (id) => {
    try {
      console.log("Preparing to send POST request...");
      const response = await axios.post(
        `https://boring-wiles.202-92-7-204.plesk.page/api/Promotion/exchangePromtion/${id}`,
        {},
        {
          headers: {
            Authorization: "Bearer " + checkLoginToken(),
            "Content-Type": "application/json",
          },
        }
      );

      console.log("POST Response:", response);
      if (response.status === 200) {
        message.success(t('profile.rewards.exchangeSuccess')); // Success message
        handelFetchData();
        fetchPromotions();
      } else {
        console.log("Unexpected Response:", response);
        message.error(t('profile.rewards.exchangeError')); // Error message
      }
    } catch (error) {
      console.error("Error in POST request:", error.response || error.message);
      message.error(t('profile.rewards.exchangeError')); // Error message
    }
  };

  const fetchPointHistory = async () => {
    try {
      const { data } = await axios.get(
        "https://boring-wiles.202-92-7-204.plesk.page/api/PointUser/GetPointHistoryByUserId",
        {
          headers: {
            Authorization: "Bearer " + checkLoginToken(),
          },
        }
      );
  
      // Chỉ lấy các mục có points > 0 hoặc minusPoints > 0
      const filteredHistory = data
        .filter((entry) => entry.points > 0 || entry.minusPoints > 0)
        .map((entry) => ({
          date: entry.date, // Giữ nguyên ngày
          points: entry.points > 0 ? entry.points : -entry.minusPoints, // Điểm cộng hoặc trừ
        }));
  
      setPointHistory(filteredHistory);
    } catch (error) {
      console.error("Error fetching point history:", error);
      // message.error(t("profile.rewards.historyError")); // Thông báo lỗi
    }
  };
  
  useEffect(() => {
    handelFetchData();
    fetchPromotions();
    fetchPointHistory(); // Gọi API lấy lịch sử điểm thưởng
  }, []);
  
  
  useEffect(() => {
    handelFetchData();
    fetchPromotions();
    fetchPointHistory(); // Gọi thêm API lịch sử điểm thưởng
  }, []);
  
  useEffect(() => {
    handelFetchData();
    fetchPromotions();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">{t('profile.rewards.title')}</h2>
      
      <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
        <p className="text-gray-600 mb-2">{t('profile.rewards.currentPoints')}:</p>
        <h3 className="text-4xl font-bold text-blue-600">
          {dataUser?.points || 0} {t('profile.rewards.points')}
        </h3>
        <button
          className="mt-4 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors duration-200"
          onClick={() => setShowHistory(true)}
        >
          {t('profile.rewards.history')}
        </button>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">{t('profile.rewards.exchange')}</h3>
        {promotions.length > 0 ? (
          <div className="space-y-4 max-h-96 overflow-y-auto rounded-lg border border-gray-200">
            {promotions.map((promo) => (
              <div
                key={promo.id}
                className="p-4 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-800">{promo.codePromotion}</p>
                    <p className="text-gray-600">{promo.description}</p>
                    <p className="text-sm text-gray-500">
                      {t('profile.rewards.requiredPoints')}: {promo.exchangePoint}
                    </p>
                  </div>
                  <button
                    className={`px-4 py-2 rounded transition-colors duration-200 ${
                      dataUser?.points >= promo.exchangePoint
                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                    onClick={() => handleExchange(promo.id)}
                    disabled={dataUser?.points < promo.exchangePoint}
                  >
                    {t('profile.rewards.exchange')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">{t('profile.rewards.noPromotions')}</p>
        )}
      </div>
      {showHistory && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 max-w-lg w-full m-4">
      <h2 className="text-xl font-semibold mb-4">{t("profile.rewards.history")}</h2>
      <div className="max-h-[60vh] overflow-y-auto space-y-3">
        {pointHistory.length > 0 ? (
          pointHistory.map((entry, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
            >
              {/* Ngày */}
              <p className="text-gray-700">{new Date(entry.date).toLocaleDateString()}</p>
              {/* Điểm cộng hoặc trừ */}
              <p
                className={`text-lg font-semibold ${
                  entry.points > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {entry.points > 0 ? `+${entry.points}` : entry.points}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">{t("profile.rewards.noHistory")}</p>
        )}
      </div>
      <button
        className="mt-4 w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors duration-200"
        onClick={() => setShowHistory(false)}
      >
        {t("profile.rewards.close")}
      </button>
    </div>
  </div>
)}


    </div>
  );
};

export default RewardPoints;
