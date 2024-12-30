import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { checkLoginToken } from "../utils";
import Header from "./Header";
import { FaBus } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { BsClock, BsCashCoin } from "react-icons/bs";
import { MdPayment } from "react-icons/md";

const DetailTicket = () => {  
  const { id } = useParams();
  const navigate = useNavigate(); // Hook for navigation
  const [ticket, setTicket] = useState(null);
  const [licensePlate, setLicensePlate] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        const { data } = await axios.get(
          `https://boring-wiles.202-92-7-204.plesk.page/api/Ticket/ticketById/${id}`,
          {
            headers: {
              Authorization: "Bearer " + checkLoginToken(),
            },
          }
        );
        setTicket(data);

        if (data.vehicleId) {
          const vehicleResponse = await axios.get(
            `https://boring-wiles.202-92-7-204.plesk.page/api/Vehicle/getInforVehicle/${data.vehicleId}`,
            {
              headers: {
                Authorization: "Bearer " + checkLoginToken(),
              },
            }
          );
          setLicensePlate(vehicleResponse.data.licensePlate);
          setDescription(vehicleResponse.data.description);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching ticket details:", error);
        setLoading(false);
      }
    };

    fetchTicketDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Không tìm thấy thông tin vé
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-orange-600 p-6">
              <div className="flex justify-between items-center">
                <img
                  src="/src/assets/logo.png"
                  className="w-16 h-auto"
                  alt="Logo"
                />
                <div className="text-white">
                  <span className="text-sm">MÃ VÉ:</span>
                  <span className="ml-2 font-bold text-yellow-300">{id}</span>
                </div>
              </div>
            </div>

            {/* Nút Quay lại */}
            <div className="p-4">
              <button
                onClick={() => navigate("/profile/my-order")}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
              >
                Quay lại
              </button>
            </div>

            {/* Ticket Content */}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
                Thông tin vé xe
              </h2>

              <div className="space-y-4">
                <TicketRow icon={<FaBus />} label="Hãng xe" value={description} />
                <TicketRow
                  icon={<IoLocationSharp />}
                  label="Điểm đón"
                  value={ticket.pointStart}
                />
                <TicketRow
                  icon={<BsClock />}
                  label="Ghi chú"
                  value={ticket.note}
                />
                <TicketRow
                  icon={<IoLocationSharp />}
                  label="Điểm trả"
                  value={ticket.pointEnd}
                />
                <TicketRow
                  icon={<FaBus />}
                  label="Tuyến"
                  value={ticket.description}
                />
                <TicketRow icon={<FaBus />} label="Biển số xe" value={licensePlate} />
                <TicketRow
                  icon={<BsCashCoin />}
                  label="Tổng tiền"
                  value={`${ticket.pricePromotion.toLocaleString()} VND`}
                  highlight
                />
                <TicketRow
                  icon={<MdPayment />}
                  label="Trạng thái thanh toán"
                  value={ticket.status}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="bg-blue-500 p-4 text-white text-sm">
              <div className="flex justify-between items-center">
                <span>Hotline: 1900 xxxx</span>
                <span>E-Ticket ({new Date().toLocaleString()})</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

const TicketRow = ({ icon, label, value, highlight = false }) => (
  <motion.div
    whileHover={{ scale: 1.01 }}
    className={`flex items-center space-x-3 p-3 rounded-lg ${
      highlight ? "bg-blue-50" : "hover:bg-gray-50"
    }`}
  >
    <span className="text-blue-500 text-xl">{icon}</span>
    <div className="flex-1">
      <span className="text-blue-600">{label}:</span>
      <span
        className={`ml-2 font-medium ${
          highlight ? "text-blue-600" : "text-gray-900"
        }`}
      >
        {value || "Đang tải..."}
      </span>
    </div>
  </motion.div>
);

export default DetailTicket;
