import { Outlet, useNavigate } from "react-router-dom";
import Header from "../Header";
const Profile = () => {
  const navigate = useNavigate();
  return (
    <>
      <Header />
      <div className="flex justify-center items-start min-h-screen p-10">
        <div className="bg-white shadow-md rounded-lg w-full max-w-4xl p-6">
          <div className="text-sm text-gray-500 mb-4">
            <a href="#" className="text-blue-500">
              Trang chủ
            </a>{" "}
            &gt; Thông tin tài khoản
          </div>
          <div className="flex">
            <div className="w-1/4 pr-4">
              <ul className="space-y-4">
                <li className="flex items-center text-blue-500">
                  <i className="fas fa-user-circle mr-2"></i>
                  <span>Thông tin tài khoản</span>
                </li>
                <li
                  onClick={() => {
                    navigate("/profile/reward-point");
                  }}
                  className="flex items-center text-gray-700 cursor-pointer"
                >
                  <i className="fas fa-user mr-2"></i>
                  <span>
                    Thành viên <strong>Thường</strong>
                  </span>
                </li>
                <li
                  className="flex items-center text-gray-700 cursor-pointer"
                  onClick={() => {
                    navigate("/profile/my-order");
                  }}
                >
                  <i className="fas fa-box mr-2"></i>
                  <span>Đơn hàng của tôi</span>
                </li>
                <li className="flex items-center text-gray-700 cursor-pointer"
                onClick={() => {
                  navigate("/profile/my-promotion");
                }}>

                  <i className="fas fa-gift mr-2"></i>
                  <span>Ưu đãi</span>
                </li>
                <li
                  onClick={() => {
                    navigate("/profile/change-pass");
                  }}
                  className="flex items-center text-gray-700 cursor-pointer"
                >
                  <i className="fas fa-credit-card mr-2"></i>
                  <span>Đổi mật khẩu</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <i className="fas fa-comment-dots mr-2"></i>
                  <span>Nhận xét chuyến đi</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <i className="fas fa-power-off mr-2"></i>
                  <span>Đăng xuất</span>
                </li>
              </ul>
            </div>
            <div className="w-3/4 pl-4">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
