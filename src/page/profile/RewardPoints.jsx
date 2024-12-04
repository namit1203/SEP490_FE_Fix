import axios from "axios";
import React, { useEffect, useState } from "react";
import { checkLoginToken } from "../../utils";

const RewardPoints = () => {
  const [dataUser, setDataUser] = useState(null);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false); // State for point history modal
  const [pointHistory, setPointHistory] = useState([]); // Placeholder for point history

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

  const handleExchange = async (id) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `https://boring-wiles.202-92-7-204.plesk.page:5127/api/Promotion/exchangePromtion/${id}`,
        {},
        {
          headers: {
            Authorization: "Bearer " + checkLoginToken(),
          },
        }
      );
      alert("Exchange successful!");
      handelFetchData();
      fetchPromotions();
    } catch (error) {
      console.error("Exchange failed", error);
      alert("Failed to exchange promotion");
    } finally {
      setLoading(false);
    }
  };

  // Simulated point history (replace with API if available)
  useEffect(() => {
    setPointHistory([
      { date: "2024-01-01", points: 50 },
      { date: "2024-02-15", points: -20 },
      { date: "2024-03-10", points: 100 },
    ]);
  }, []);

  useEffect(() => {
    handelFetchData();
    fetchPromotions();
  }, []);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Điểm Tích Lũy</h2>
      {/* Display user points */}
      <div className="bg-blue-100 p-4 rounded-lg mb-6">
        <p className="text-gray-600">Điểm hiện tại của bạn:</p>
        <h3 className="text-4xl font-bold text-blue-600">{dataUser?.points || 0} điểm</h3>
        <button
          className="mt-4 bg-gray-500 text-white px-3 py-1 rounded"
          onClick={() => setShowHistory(true)}
        >
          Lịch sử cộng điểm
        </button>
      </div>

      {/* Display promotion list */}
      <h3 className="text-xl font-semibold text-gray-800 mb-2">Đổi Điểm Lấy Ưu Đãi</h3>
      {loading ? (
        <p className="text-gray-500">Đang tải...</p>
      ) : promotions.length > 0 ? (
        <div
          className="space-y-4 overflow-y-auto max-h-96 p-2 border rounded-lg"
          style={{ scrollbarWidth: "thin", scrollbarColor: "#CBD5E0 transparent" }}
        >
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

      {/* Point History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h2 className="text-xl font-semibold mb-4">Lịch Sử Cộng Điểm</h2>
            <div className="max-h-64 overflow-y-auto space-y-4">
              {pointHistory.length > 0 ? (
                pointHistory.map((entry, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-gray-100 rounded-lg"
                  >
                    <p className="text-gray-700">{entry.date}</p>
                    <p
                      className={`text-lg font-semibold ${
                        entry.points > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {entry.points > 0 ? `+${entry.points}` : `${entry.points}`}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Không có lịch sử cộng điểm.</p>
              )}
            </div>
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => setShowHistory(false)}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardPoints;
