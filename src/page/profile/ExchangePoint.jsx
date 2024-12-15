import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import axios from "axios";
import { checkLoginToken } from "../../utils";
import { message } from "antd";

const ExchangePoint = () => {
  const [points, setPoints] = useState(0);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const fetchPoints = async () => {
    try {
      const { data } = await axios.get(
        "https://boring-wiles.202-92-7-204.plesk.page/api/PointUser/getPointUserByUserId",
        {
          headers: {
            Authorization: "Bearer " + checkLoginToken(),
          },
        }
      );
      setPoints(data?.points || 0);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchPromotions = async () => {
    setLoading(true);
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
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExchange = async (promotionId, requiredPoints) => {
    if (points < requiredPoints) {
      alert(t('profile.rewards.insufficientPoints'));
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        `https://boring-wiles.202-92-7-204.plesk.page/api/Promotion/exchangePromtion/${promotionId}`,
        {},
        {
          headers: {
            Authorization: "Bearer " + checkLoginToken(),
          },
        }
      );
      message.success("Đổi điểm thành công");

      fetchPoints();
      fetchPromotions();
    } catch (error) {
      console.error("Error:", error);
      alert(t('profile.rewards.exchangeError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoints();
    fetchPromotions();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('profile.rewards.exchange')}</h2>
        <div className="bg-blue-50 px-4 py-2 rounded-lg">
          <span className="text-gray-600">{t('profile.rewards.currentPoints')}:</span>
          <span className="ml-2 text-blue-600 font-bold">{points} {t('profile.rewards.points')}</span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">{t('profile.rewards.loading')}</p>
        </div>
      ) : promotions.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {promotions.map((promotion) => (
            <div
              key={promotion.id}
              className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{promotion.codePromotion}</h3>
                  <p className="text-gray-600 text-sm mt-1">{promotion.description}</p>
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                  {promotion.discount}% OFF
                </span>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-500">
                  {t('profile.rewards.requiredPoints')}: {promotion.exchangePoint}
                </span>
                <button
                  onClick={() => handleExchange(promotion.id, promotion.exchangePoint)}
                  disabled={points < promotion.exchangePoint || loading}
                  className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                    points >= promotion.exchangePoint
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {t('profile.rewards.exchange')}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">{t('profile.rewards.noPromotions')}</p>
        </div>
      )}
    </div>
  );
};

export default ExchangePoint;
