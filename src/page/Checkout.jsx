import React, { useState } from "react";
import { Col, Input, Row, Button, Modal, Form } from "antd";
import { CloseCircleOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import confirm from "antd/lib/modal/confirm";
import Footer from "./Footer";
import Header from "./Header";

const Checkout = () => {
  const [editUser, setEditUser] = useState(false);

  const handleEditUser = (item) => {
    setEditUser(!editUser);
  };
  function showDeleteConfirm() {
    confirm({
      title: "Bạn có chắc chắn muốn hủy vé không?",
      icon: <QuestionCircleOutlined style={{ color: "red" }} />,
      content: "Thao tác này sẽ không khôi phục được !",
      okText: "Có",
      okType: "danger",
      cancelText: "Không",
      onOk() {
        console.log("OK");
      },
      onCancel() {},
    });
  }

  return (
    <div>
      <Header />
      <div className="max-w-[980px] mx-auto my-8 pb-12">
        <h2 className="text-blue-600 font-bold">Đặt vé thành công</h2>
        <Row className="mb-8">
          <Col className="w-full">
            <div className="flex justify-between items-center mt-4 border-b border-gray-200">
              <h3>Thông tin chuyến đi</h3>
              <div className="flex items-center">
                <a
                  href="#!"
                  onClick={(e) => {
                    e.preventDefault();
                    setEditUser(!editUser);
                  }}
                >
                  Sửa
                </a>
                <Modal
                  title="Đổi thông tin liên hệ"
                  visible={editUser}
                  onOk={handleEditUser}
                  onCancel={() => setEditUser(!editUser)}
                  footer={null}
                >
                  <Form
                    name="basic"
                    layout="vertical"
                    initialValues={{ remember: true }}
                    onFinish={() => null}
                    onFinishFailed={() => null}
                    autoComplete="off"
                  >
                    <Form.Item
                      label="Họ và tên"
                      name="Fullname"
                      rules={[
                        { required: true, message: "Vui lòng nhập Tên!" },
                      ]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label="Email"
                      name="Email"
                      rules={[
                        { required: true, message: "Vui lòng nhập Email!" },
                      ]}
                    >
                      <Input />
                    </Form.Item>

                    <Button className="w-full bg-yellow-500" htmlType="submit">
                      Cập nhật
                    </Button>
                  </Form>
                </Modal>
              </div>
            </div>

            <div className="border border-gray-200 rounded-md p-5">
              {[
                { label: "Mã đơn hàng", value: "ABCDXYZ" },
                { label: "Hành khách", value: "Nguyễn Văn A" },
                { label: "Số điện thoại", value: "0868268142" },
                { label: "Email", value: "Tuanphan204@gmail.com" },
                { label: "Nhà xe", value: "Hoàng đức Limousine" },
                { label: "Tuyến đường", value: "Hà Nội - Đà Nẵng" },
                { label: "Mã ghế", value: "B2" },
                { label: "Giá vé", value: "1x 190.000đ" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between border-b border-gray-200 py-4"
                >
                  <p>{item.label}</p>
                  <h4>{item.value}</h4>
                </div>
              ))}
              <div className="flex justify-between border-b border-gray-200 py-4 font-bold">
                <p>Tổng tiền</p>
                <h3>190.000đ</h3>
              </div>
            </div>
          </Col>
        </Row>
        <div className="flex gap-4">
          <Button
            type="primary"
            danger
            icon={<CloseCircleOutlined />}
            onClick={showDeleteConfirm}
            className="w-1/2"
          >
            Hủy vé
          </Button>
          <Button type="primary" className="w-1/2">
            Xem vé
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
