import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/app.context";
import { checkLoginToken } from "../../utils";

const Info = () => {
  const { profile } = useContext(AppContext);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    numberPhone: "",
    avatar: "",
    fullName: "",
    address: "",
    dob: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile?.username || "",
        email: profile?.email || "",
        numberPhone: profile?.numberPhone || "",
        avatar: profile?.avatar || "https://statics.oeg.vn/storage/DEFAULT%20AVATAR%20PROFILE/akirofemalev9.webp",
        fullName: profile?.fullName || "",
        address: profile?.address || "",
        dob: profile?.dob?.split("T")?.[0] || "",
      });
    }
  }, [profile]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(
        `https://boring-wiles.202-92-7-204.plesk.page/api/User/EditProfile/` +
          profile.id,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
            Authorization: "Bearer " + checkLoginToken(),
          },
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        // Thông báo thành công hoặc cập nhật giao diện
        alert("Cập nhật thông tin thành công!");
      } else {
        alert("Có lỗi xảy ra khi cập nhật!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Có lỗi xảy ra khi kết nối!");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-gray-700">
          Họ và tên<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded p-2 mt-1"
        />
      </div>
      <div>
        <label className="block text-gray-700">
          Email<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded p-2 mt-1"
        />
      </div>
      <div>
        <label className="block text-gray-700">Số điện thoại</label>
        <input
          type="text"
          name="numberPhone"
          value={formData.numberPhone}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded p-2 mt-1"
        />
      </div>
      <div>
        <label className="block text-gray-700">Ngày sinh</label>
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded p-2 mt-1"
        />
      </div>
      <div>
        <label className="block text-gray-700">Địa chỉ</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded p-2 mt-1"
        />
      </div>
      <div>
        <button
          onClick={handleSave}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded"
        >
          Lưu
        </button>
      </div>
    </div>
  );
};

export default Info;
