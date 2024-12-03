import {
  Breadcrumb,
  Button,
  Checkbox,
  DatePicker,
  Drawer,
  Form,
  Input,
  message,
  Popconfirm,
  Select,
  Table,
} from "antd";
import axios from "axios";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { checkLoginToken } from "../../../utils";

const FixedCosts = () => {
  const [open, setOpen] = useState(false);
  const [idUser, setIdUser] = useState<any>(null);
  const [dataUser, setDataUser] = useState([]);
  const [datalistVehicle, setDatalistVehicle] = useState([]);
  const [datalistLossCostType, setDatalistLossCostType] = useState([]);

  const [form] = Form.useForm();
  const [checkAdd, setCheckAdd] = useState(false);
  const handelFetchData = async () => {
    try {
      const { data } = await axios.get(
        "https://boring-wiles.202-92-7-204.plesk.page/api/LossCostVehicle/lossCostCar/vehicleId/startDate/endDate",
        {
          headers: {
            Authorization: "Bearer " + checkLoginToken(),
          },
        }
      );
      setDataUser(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handelFetchDatalistVehicle = async () => {
    try {
      const { data } = await axios.get(
        "https://boring-wiles.202-92-7-204.plesk.page/api/Vehicle/listVehicle",
        {
          headers: {
            Authorization: "Bearer " + checkLoginToken(),
          },
        }
      );
      setDatalistVehicle(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handelFetchDatalistLossCostType = async () => {
    try {
      const { data } = await axios.get(
        "https://boring-wiles.202-92-7-204.plesk.page/api/LossCostType/listLossCostType",
        {
          headers: {
            Authorization: "Bearer " + checkLoginToken(),
          },
        }
      );
      setDatalistLossCostType(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    handelFetchData();
    handelFetchDatalistVehicle();
    handelFetchDatalistLossCostType()
  }, []);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    setIdUser(null);
    setCheckAdd(false);

    form.resetFields();
  };

  const confirm = async (e) => {
    try {
      await axios.delete(
        `https://boring-wiles.202-92-7-204.plesk.page/api/LossCostVehicle/deleteLossCost/id?id=${e}`,
        {
          headers: {
            Authorization: "Bearer " + checkLoginToken(),
          },
        }
      );
      handelFetchData();
      message.success("Xóa thành công!");
    } catch (error) {
      message.error("Lỗi khi xóa dữ liệu!");
    }
  };

  const onFinish = async (values) => {
    try {
        if(idUser){
            const payload = {
                ...values,
                vehicleId: idUser.vehicleId,
                price: Number(idUser.price),
                updateAt: dayjs().toISOString(),
                dateIncurred: values.dateIncurred.format("YYYY-MM-DDTHH:mm:ss"),
              };
              const url = idUser
                ? `https://boring-wiles.202-92-7-204.plesk.page/api/LossCostVehicle/updateLossCost/id?id=${idUser.lossCostTypeId}`
                : `https://boring-wiles.202-92-7-204.plesk.page/api/LossCostVehicle/addLossCostVehicle`;
        
              await axios.put(url, payload, {
                headers: {
                  Authorization: "Bearer " + checkLoginToken(),
                },
              });
        
              message.success(idUser ? "Cập nhật thành công!" : "Thêm mới thành công!");
              onClose();
              handelFetchData();
        }else {
            const payload = {
                ...values,
                updateAt: dayjs().toISOString(),
                dateIncurred: values.dateIncurred.format("YYYY-MM-DDTHH:mm:ss"),
              };
              const url =  `https://boring-wiles.202-92-7-204.plesk.page/api/LossCostVehicle/addLossCostVehicle`;
              await axios.post(url, payload, {
                headers: {
                  Authorization: "Bearer " + checkLoginToken(),
                },
              });
        
              message.success(idUser ? "Cập nhật thành công!" : "Thêm mới thành công!");
              onClose();
              handelFetchData();
        }
    
    } catch (error) {
      message.error("Lỗi khi cập nhật dữ liệu!");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
console.log(idUser,'idUser')
  useEffect(() => {
    if (idUser) {
      try {
        form.setFieldsValue({
          ...idUser,
          dateIncurred: dayjs(idUser.dateIncurred),
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  }, [open, idUser, form]);

  const columns = [
    {
      title: "Chi tiết",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Biển số",
      dataIndex: "licensePlate",
      key: "licensePlate",
    },
    {
      title: "Chi phí",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Action",
      render: (record) => (
        <div className="space-x-5">
          <Button
            onClick={() => confirm(record.id)}
            className="bg-red-500 text-white font-semibold"
          >
            Xóa
          </Button>
          <Button
            onClick={() => {
              setIdUser(record);
              showDrawer();
              setCheckAdd(false);
            }}
            className="font-semibold"
          >
            Chỉnh sửa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-end">
        <Button
          onClick={() => {
            showDrawer();
            setCheckAdd(true);
          }}
          className="bg-green-500 text-white font-medium"
        >
          Thêm Mới
        </Button>
      </div>
      <Table dataSource={dataUser} columns={columns} rowKey="id" />
      <Drawer
        title={idUser ? "Cập nhật thông tin" : "Thêm mới"}
        onClose={onClose}
        open={open}
        width={700}
      >
        <Form
          form={form}
          name="lossCostDetails"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          {checkAdd ? (
            <>
              <Form.Item
                name="vehicleId"
                label="Xe"
                
              >
                <Select placeholder="Xe" size="large">
                  {datalistVehicle?.map((category :any) => {
                    return (
                        <Select.Option
                          value={category?.id}
                          key={category?.id}
                        >
                          <span className="text-sm capitalize">
                            {category?.description} - {category?.licensePlate}
                          </span>
                        </Select.Option>
                      )
                  })}
                </Select>
              </Form.Item>
              <Form.Item
                name="lossCostTypeId"
                label=" Loại chi phí tổn thất"
              >
                <Select placeholder=" Loại chi phí tổn thất" size="large">
                  {datalistLossCostType?.map((category :any) => {
                    console.log(category,'category')

                    return (
                        <Select.Option
                          value={category?.id}
                          key={category?.id}
                        >
                          <span className="text-sm capitalize">
                            {category?.description}
                          </span>
                        </Select.Option>
                      )
                  })}
                </Select>
              </Form.Item>
              <Form.Item
                label="Giá"
                name="price"
                rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Mô tả"
                name="description"
                rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Ngày phát sinh"
                name="dateIncurred"
                rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}
              >
                <DatePicker format="YYYY-MM-DD" />
              </Form.Item>
            </>
          ) : (
            <>
              <Form.Item
                label="Loại chi phí"
                name="lossCostTypeId"
                rules={[
                  { required: true, message: "Vui lòng nhập loại chi phí!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Giá"
                name="price"
                rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Mô tả"
                name="description"
                rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Ngày phát sinh"
                name="dateIncurred"
                rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}
              >
                <DatePicker format="YYYY-MM-DD" />
              </Form.Item>
            </>
          )}
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              {idUser ? "Cập nhật" : "Thêm mới"}
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default FixedCosts;
