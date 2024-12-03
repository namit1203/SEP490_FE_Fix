import React, { useEffect, useState } from "react";
import Header from "./Header";
import { checkLoginToken } from "../utils";
import axios from "axios";

const PaymentMethod = () => {
  const [promotion, setPromotion] = useState([]);
  const handelFetchData = async () => {
    const { data } = await axios.get(
      "https://boring-wiles.202-92-7-204.plesk.page/api/Promotion",
      {
        headers: {
          Authorization: "Bearer " + checkLoginToken(),
        },
      }
    );
    const currentDate = new Date();
    const validPromotions = data.filter(
      (item) => new Date(item.endDate) > currentDate
    );
    setPromotion(validPromotions);
  };
  useEffect(()=>{
    handelFetchData()
  },[])
  return (
    <div>
        <Header/>
      <div className="max-w-5xl mx-auto p-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Phương thức thanh toán</h2>
            <div className="mb-4">
              <input type="radio" id="qr" name="payment" className="mr-2" />
              <label htmlFor="qr" className="font-bold">
                QR chuyển khoản/ Ví điện tử
              </label>
              <span className="ml-2 bg-green-100 text-green-700 px-2 py-1 rounded">
                An toàn & tiện lợi
              </span>
              <p className="text-gray-500 mt-2">
                Không cần nhập thông tin. Xác nhận thanh toán tức thì, nhanh
                chóng và ít sai sót.
              </p>
              <div className="flex mt-2">
                <img
                  src="https://placehold.co/40x40"
                  alt="MoMo logo"
                  className="mr-2"
                />
                <img
                  src="https://placehold.co/40x40"
                  alt="ZaloPay logo"
                  className="mr-2"
                />
                <img
                  src="https://placehold.co/40x40"
                  alt="ShopeePay logo"
                  className="mr-2"
                />
                <img
                  src="https://placehold.co/40x40"
                  alt="ViettelPay logo"
                  className="mr-2"
                />
                <img
                  src="https://placehold.co/40x40"
                  alt="ACB logo"
                  className="mr-2"
                />
                <a href="#" className="text-blue-500">
                  Xem tất cả
                </a>
              </div>
            </div>
            <div className="mb-4 bg-yellow-100 p-2 rounded">
              <span className="text-yellow-700">
                Chuyến đi chưa được bảo vệ
              </span>
              <a href="#" className="text-blue-500 ml-2">
                Thêm bảo hiểm
              </a>
            </div>
            <div className="mb-4">
              <input
                type="radio"
                id="pay-on-bus"
                name="payment"
                className="mr-2"
              />
              <label htmlFor="pay-on-bus" className="font-bold">
                Thanh toán khi lên xe
              </label>
              <p className="text-gray-500 mt-2">
                Bạn có thể thanh toán cho tài xế khi lên xe
              </p>
            </div>
            <div className="mb-4">
              <input type="radio" id="momo" name="payment" className="mr-2" />
              <label htmlFor="momo" className="font-bold">
                Ví MoMo
              </label>
              <p className="text-gray-500 mt-2">
                Điện thoại của bạn phải được cài đặt ứng dụng MoMo
              </p>
              <p className="text-green-600 mt-2">
                Giảm 20K và 60K khi nhập mã MOMOFLASH15 lần lượt cho đơn hàng từ
                300K và 1.200K trong khung giờ Flash Sale 12h - 14h ngày
                29/10/2024
              </p>
              <a href="#" className="text-blue-500">
                Điều kiện sử dụng
              </a>
            </div>
            <div className="mb-4">
              <input
                type="radio"
                id="international-card"
                name="payment"
                className="mr-2"
              />
              <label htmlFor="international-card" className="font-bold">
                Thẻ thanh toán quốc tế
              </label>
              <p className="text-gray-500 mt-2">Thẻ Visa, MasterCard, JCB</p>
              <p className="text-gray-500 mt-2">
                1/ Nhập mã VXRHDS50 hoặc VXRHDS100 tại Vexere - Giảm 50K hoặc
                100K lần lượt cho đơn từ 250K hoặc 100K khi thanh toán bằng Thẻ
                Tín dụng quốc tế HDSAISON.
              </p>
              <p className="text-gray-500 mt-2">
                2/Nhập mã VEXEREHOME tại Vexere - Giảm 20% tối đa 60K khi thanh
                toán bằng Thẻ tín dụng Home Credit
              </p>
            </div>
            <button className="w-full bg-yellow-500 text-white py-2 rounded font-bold">
              Thanh toán
            </button>
            <p className="text-gray-500 text-center mt-2">
              Bằng việc nhấn nút Thanh toán, bạn đồng ý với{" "}
              <a href="#" className="text-blue-500">
                Chính sách bảo mật thanh toán
              </a>
            </p>
          </div>
          <div className="col-span-1">
            <div className="bg-white p-4 rounded shadow mb-4">
              <h2 className="text-xl font-bold mb-4">Tổng tiền</h2>
              <p className="text-2xl font-bold text-red-500">750.000đ</p>
            </div>
            <div className="bg-white p-4 rounded shadow mb-4">
              <h2 className="text-xl font-bold mb-4">Mã giảm giá</h2>
              <a href="#" className="text-blue-500">
                Chọn hoặc nhập mã
              </a>
              <div className="mt-4">
                <div className="flex items-center mb-2">
                  <input
                    type="radio"
                    id="discount1"
                    name="discount"
                    className="mr-2"
                  />
                  <label htmlFor="discount1" className="flex items-center">
                    <img
                      src="https://placehold.co/40x40"
                      alt="Discount 1"
                      className="mr-2"
                    />
                    <div>
                      <p className="font-bold">Giảm 20%, tối đa 200K</p>
                      <p className="text-gray-500">Đơn hàng tối đa 1 vé</p>
                    </div>
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="discount2"
                    name="discount"
                    className="mr-2"
                  />
                  <label htmlFor="discount2" className="flex items-center">
                    <img
                      src="https://placehold.co/40x40"
                      alt="Discount 2"
                      className="mr-2"
                    />
                    <div>
                      <p className="font-bold">Giảm 100K</p>
                      <p className="text-gray-500">Đơn hàng tối đa 1 vé</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-bold mb-4">Thông tin chuyến đi</h2>
              <div className="flex items-center mb-4">
                <i className="fas fa-bus text-blue-500 mr-2"></i>
                <p className="font-bold">T3, 29/10/2024</p>
                <span className="ml-2">1</span>
                <a href="#" className="text-blue-500 ml-auto">
                  Chi tiết
                </a>
              </div>
              <div className="flex items-center mb-4">
                <img
                  src="https://placehold.co/60x40"
                  alt="Bus image"
                  className="mr-2"
                />
                <div>
                  <p className="font-bold">Sao Việt</p>
                  <p className="text-gray-500">Limousine giường phòng 21 chỗ</p>
                </div>
              </div>
              <div className="flex items-center mb-4">
                <i className="fas fa-clock text-blue-500 mr-2"></i>
                <p className="font-bold">23:00</p>
                <p className="ml-2">Văn phòng 7 Phạm Văn Đồng</p>
                <a href="#" className="text-blue-500 ml-auto">
                  Văn phòng
                </a>
              </div>
              <div className="flex items-center">
                <i className="fas fa-clock text-blue-500 mr-2"></i>
                <p className="font-bold">04:40</p>
                <p className="ml-2">Văn phòng Sapa</p>
                <a href="#" className="text-blue-500 ml-auto">
                  Thay đổi
                </a>
              </div>
            </div>
          </div>
        </div>
        <p className="text-gray-500 text-center mt-4">
          Bạn sẽ sớm nhận được biển số xe, số điện thoại tài xế và dễ dàng thay
          đổi điểm đón trả sau khi đặt.
        </p>
      </div>
    </div>
  );
};

export default PaymentMethod;
