import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AppContext } from "../../context/app.context";
import { checkLoginToken } from "../../utils";
import { message } from "antd";

const Info = () => {
  const { t } = useTranslation();
  const { profile, setProfile } = useContext(AppContext);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    numberPhone: "",
    avatar: "https://statics.oeg.vn/storage/DEFAULT%20AVATAR%20PROFILE/akirofemalev9.webp",
    avatarFile: null,
    fullName: "",
    address: "",
    dob: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `https://boring-wiles.202-92-7-204.plesk.page/api/Auth/userProfile`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              accept: "*/*",
              Authorization: "Bearer " + checkLoginToken(),
            },
          }
        );
  
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
          setFormData({
            email: data.email || "",
            numberPhone: data.numberPhone || "",
            avatar: data.avatar || "https://statics.oeg.vn/storage/DEFAULT%20AVATAR%20PROFILE/akirofemalev9.webp",
            avatarFile: null,
            fullName: data.fullName || "",
            address: data.address || "",
            dob: data.dob?.split("T")?.[0] || "",
          });
        } else {
          message.error(t("profile.info.fetchError"));
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        message.error(t("profile.info.fetchError"));
      }
    };
  
    fetchProfile();
  }, [setProfile, t]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        "https://boring-wiles.202-92-7-204.plesk.page/api/UploadImage/image",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + checkLoginToken(),
          },
          body: formData,
        }
      );

      if (response.ok) {
        const result = await response.json();
        message.success(t("profile.info.uploadSuccess"));
        return result.url; // Trả về URL của ảnh vừa upload
      } else {
        const errorResponse = await response.json();
        console.error("Upload error:", errorResponse);
        message.error(t("profile.info.uploadError"));
        return null;
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      message.error(t("profile.info.uploadError"));
      return null;
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      if (!validTypes.includes(file.type)) {
        message.error(t("profile.info.invalidImageType"));
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        message.error(t("profile.info.fileTooLarge"));
        return;
      }

      // Gửi ảnh lên server
      const uploadedUrl = await handleFileUpload(file);
      if (uploadedUrl) {
        // Nếu upload thành công, cập nhật formData.avatar
        setFormData((prevData) => ({
          ...prevData,
          avatar: uploadedUrl,
        }));
      }
    }
  };

  const handleSave = async () => {
    // Kiểm tra nếu fullName trống
    if (!formData.fullName.trim()) {
      message.error(t("profile.info.fullNameRequired")); // Hiển thị thông báo lỗi
      return; // Dừng thực hiện nếu không hợp lệ
    }
  
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("email", formData.email);
      formDataToSend.append("numberPhone", formData.numberPhone);
      formDataToSend.append("fullName", formData.fullName);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("dob", formData.dob);
      formDataToSend.append("avatar", formData.avatar);
  
      const response = await fetch(
        `https://boring-wiles.202-92-7-204.plesk.page/api/User/EditProfile/`,
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + checkLoginToken(),
          },
          body: formDataToSend,
        }
      );
  
      const text = await response.text();
      console.log("API Response:", text);
  
      if (response.ok) {
        if (text.includes("Update user profile successful")) {
          message.success(t("profile.info.updateSuccess"));
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          message.success(text);
        }
      } else {
        message.error(t("profile.info.updateError"));
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error(t("profile.info.updateError"));
    }
  };
  
  

  useEffect(() => {
    return () => {
      if (formData.avatarFile) {
        URL.revokeObjectURL(formData.avatar);
      }
    };
  }, [formData.avatarFile]);

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {t("profile.info.title")}
      </h2>

      <div className="grid gap-6">
        <div className="flex items-center space-x-4">
          <img
            src={formData.avatar}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border-4 border-blue-50"
          />
          <label className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer">
            {t("profile.info.changePhoto")}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        <div className="grid gap-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("profile.info.fullName")}<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName  }
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("profile.info.email")}<span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("profile.info.phone")}
            </label>
            <input
              type="tel"
              name="numberPhone"
              value={formData.numberPhone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("profile.info.date")}
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("profile.info.address")}
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200 resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium transition-all duration-200"
          >
            {t("profile.info.save")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Info;
