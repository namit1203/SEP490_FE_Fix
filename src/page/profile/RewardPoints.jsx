import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { checkLoginToken } from '../../utils';

const RewardPoints = () => {
  const [dataUser, setDataUser] = useState(null);
  const handelFetchData = async () => {
    const { data } = await axios.get(
      "https://boring-wiles.202-92-7-204.plesk.page/api/PointUser/getPointUserByUserId",
      {
        headers: {
          Authorization: "Bearer " + checkLoginToken(),
        },
      }
    );
    setDataUser(data);
  };
  useEffect(() => {
    handelFetchData();
  }, []);
    const userPoints = 250;
    const pointHistory = [
      { date: '2024-01-01', points: 50 },
      { date: '2024-02-15', points: -20 },
      { date: '2024-03-10', points: 100 },
    ];
    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white ">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Điểm Tích Lũy</h2>
          {/* Hiển thị số điểm hiện tại */}
          <div className="bg-blue-100 p-4 rounded-lg mb-6">
            <p className="text-gray-600">Điểm hiện tại của bạn:</p>
            <h3 className="text-4xl font-bold text-blue-600">{dataUser?.points} điểm</h3>
          </div>
          {/* Lịch sử tích điểm */}
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Lịch Sử Tích Điểm</h3>
          <div className="space-y-4">
            {pointHistory.length > 0 ? (
              pointHistory.map((entry, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-gray-100 rounded-lg"
                >
                  <p className="text-gray-700">{entry.date}</p>
                  <p className={`text-lg font-semibold ${entry.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {entry.points > 0 ? `+${entry.points}` : `${entry.points}`}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Không có lịch sử tích điểm.</p>
            )}
          </div>
        </div>
      );
}

export default RewardPoints
