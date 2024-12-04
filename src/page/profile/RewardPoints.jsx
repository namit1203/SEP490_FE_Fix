import axios from "axios";
import React, { useEffect, useState } from "react";
import { checkLoginToken } from "../../utils";

const RewardPoints = () => {
  const [dataUser, setDataUser] = useState(null);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch user points
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
      console.error("Failed to fetch user points", error);
    }
  };

  // Fetch promotions
  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        "https://boring-wiles.202-92-7-204.plesk.page/api/Promotion/listPromtionCanChange",
        {
          headers: {
            Authorization: "Bearer " + checkLoginToken(),
          },
        }
      );
      setPromotions(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch promotions", error);
      setLoading(false);
    }
  };

  // Exchange promotion
  const handleExchange = async (id) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `http://localhost:5127/api/Promotion/exchangePromtion/${id}`,
        {},
        {
          headers: {
            Authorization: "Bearer " + checkLoginToken(),
          },
        }
      );
      alert("Exchange successful!"); // Notify the user
      handelFetchData(); // Refresh user points
      fetchPromotions(); // Refresh promotions list
    } catch (error) {
      console.error("Exchange failed", error);
      alert("Failed to exchange promotion");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handelFetchData();
    fetchPromotions();
  }, []);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white ">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Điểm Tích Lũy</h2>
      {/* Display user points */}
      <div className="bg-blue-100 p-4 rounded-lg mb-6">
        <p className="text-gray-600">Điểm hiện tại của bạn:</p>
        <h3 className="text-4xl font-bold text-blue-600">{dataUser?.points || 0} điểm</h3>
      </div>

      {/* Display promotion list */}
      <h3 className="text-xl font-semibold text-gray-800 mb-2">Đổi Điểm Lấy Ưu Đãi</h3>
      {loading ? (
        <p className="text-gray-500">Đang tải...</p>
      ) : promotions.length > 0 ? (
        <div className="space-y-4">
          {promotions.map((promo) => (
            <div
              key={promo.id}
              className="flex justify-between items-center p-3 bg-gray-100 rounded-lg"
            >
              <div>
                <p className="text-gray-800 font-semibold">{promo.codePromotion}</p>
                <p className="text-gray-600">{promo.description}</p>
                <p className="text-sm text-gray-500">Điểm yêu cầu: {promo.exchangePoint}</p>
              </div>
              <button
                className="bg-green-500 text-white px-3 py-1 rounded"
                onClick={() => handleExchange(promo.id)}
                disabled={dataUser?.points < promo.exchangePoint}
              >
                Đổi
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Không có ưu đãi khả dụng.</p>
      )}
    </div>
  );
};

export default RewardPoints;
