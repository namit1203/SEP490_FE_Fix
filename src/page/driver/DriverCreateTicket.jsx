import React, { useState, useEffect } from "react";
import { Form, Input, Select, Button, message } from "antd";

const { Option } = Select;

const DriverCreateTicket = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [licensePlates, setLicensePlates] = useState([]); // Danh sách biển số xe
  const [pointStartOptions, setPointStartOptions] = useState([]); // Điểm bắt đầu
  const [pointEndOptions, setPointEndOptions] = useState([]); // Điểm kết thúc

  // Giả lập danh sách biển số xe
  useEffect(() => {
    // Dữ liệu mẫu
    const mockLicensePlates = [
      { id: 1, plate: "29A-12345" },
      { id: 2, plate: "30B-67890" },
      { id: 3, plate: "31C-54321" },
    ];
    setLicensePlates(mockLicensePlates);

    // Giả lập danh sách điểm bắt đầu
    const mockPointStart = [
      { id: 1, name: "Hà Nội" },
      { id: 2, name: "Hải Phòng" },
      { id: 3, name: "Ninh Bình" },
    ];
    setPointStartOptions(mockPointStart);

    // Giả lập danh sách điểm kết thúc
    const mockPointEnd = [
      { id: 4, name: "Đà Nẵng" },
      { id: 5, name: "Hồ Chí Minh" },
      { id: 6, name: "Cần Thơ" },
    ];
    setPointEndOptions(mockPointEnd);
  }, []);

  const handleSubmit = async (values) => {
    console.log("Form Values:", values); // Hiển thị dữ liệu nhập để debug

    try {
      setLoading(true);

      // TODO: Tích hợp API tạo vé ở đây
      // Ví dụ:
      // const response = await axios.post("https://api.example.com/create-ticket", {
      //   ...values,
      //   typeOfPayment: 1, // Loại thanh toán mặc định
      // });

      message.success("Ticket created successfully!");
      form.resetFields(); // Reset form sau khi tạo thành công
    } catch (error) {
      console.error("Error creating ticket:", error);
      message.error("Failed to create ticket.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "auto",
        padding: "20px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Create Ticket
      </h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
        initialValues={{ typeOfPayment: 1 }} // Mặc định loại thanh toán là 1
      >
        <Form.Item
          label="Number License Plate"
          name="licensePlateId"
          rules={[
            { required: true, message: "Please select a license plate!" },
          ]}
        >
          <Select placeholder="Select license plate">
            {licensePlates.map((plate) => (
              <Option key={plate.id} value={plate.id}>
                {plate.plate}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Point Start"
          name="pointStartId"
          rules={[
            { required: true, message: "Please select a starting point!" },
          ]}
        >
          <Select placeholder="Select starting point">
            {pointStartOptions.map((point) => (
              <Option key={point.id} value={point.id}>
                {point.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Point End"
          name="pointEndId"
          rules={[
            { required: true, message: "Please select an ending point!" },
          ]}
        >
          <Select placeholder="Select ending point">
            {pointEndOptions.map((point) => (
              <Option key={point.id} value={point.id}>
                {point.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Type of Payment"
          name="typeOfPayment"
          rules={[
            { required: true, message: "Payment type is required!" },
          ]}
        >
          <Input disabled placeholder="1 (Default)" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Create Ticket
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default DriverCreateTicket;
