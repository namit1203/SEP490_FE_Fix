import {
  Breadcrumb,
  Button,
  Popconfirm,
  Table,
  Drawer,
  Form,
  Input,
  message,
} from "antd";
import axios from "axios";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { checkLoginToken } from "../../../utils";

const ListVehicleRent = () => {
  const [open, setOpen] = useState(false);
  const [idUser, setIdUser] = useState(null);
  const [dataUser, setDataUser] = useState([]);
  const [form] = Form.useForm();

  const handelFetchData = async () => {
    try {
      const { data } = await axios.get(
        "https://boring-wiles.202-92-7-204.plesk.page/api/HistoryRentVehicle/ListVehicleRent",
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

  useEffect(() => {
    handelFetchData();
  }, []);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    setIdUser(null);
    form.resetFields();
  };

  const confirm = async (id) => {
    try {
      await axios.delete(
        `https://boring-wiles.202-92-7-204.plesk.page:8082/api/Driver/${id}`,
        {
          headers: {
            Authorization: "Bearer " + checkLoginToken(),
          },
        }
      );
      message.success("Vehicle removed successfully");
      handelFetchData();
    } catch (error) {
      message.error("Error deleting vehicle");
      console.error("Error deleting vehicle:", error);
    }
  };

  const cancel = () => {
    message.error("Action cancelled");
  };

  const dataSource = dataUser.filter((data) => data.status === true);

  const columns = [
    {
      title: "Số ghế",
      dataIndex: "numberSeat",
      key: "numberSeat",
    },
    {
      title: "Biển số",
      dataIndex: "licensePlate",
      key: "licensePlate",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Action",
      render: ({ id }) => (
        <div className="space-x-5">
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this task?"
            onConfirm={() => confirm(id)}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <Button className="bg-red-500 text-white font-semibold">
              Remove
            </Button>
          </Popconfirm>

          <Button
            onClick={() => {
              setIdUser(id);
              showDrawer();
            }}
            className="font-semibold"
          >
            Chi tiết
          </Button>
        </div>
      ),
    },
  ];

  const fetchVehicleData = async (id) => {
    try {
      const response = await axios.get(
        `https://boring-wiles.202-92-7-204.plesk.page/api/Vehicle/getInforVehicle/${id}`
      );
      const data = response.data;
      form.setFieldsValue({
        ...data,
        dob: data.dob ? dayjs(data.dob) : null,
        createdAt: data.createdAt ? dayjs(data.createdAt) : null,
        updateAt: data.updateAt ? dayjs(data.updateAt) : null,
      });
    } catch (error) {
      console.error("Error fetching vehicle data:", error);
    }
  };

  useEffect(() => {
    if (open && idUser) {
      fetchVehicleData(idUser);
    }
  }, [open, idUser]);

  const onFinish = async (values) => {
    try {
      await axios.put(
        `https://boring-wiles.202-92-7-204.plesk.page:8082/api/Driver/${idUser}`,
        {
          ...values,
          dob: "2024-10-31T03:44:08.522Z",
          statusWork: "string",
          typeOfDriver: 0,
          status: true,
        }
      );
      message.success("Vehicle details updated successfully");
      onClose();
      handelFetchData();
    } catch (error) {
      message.error("Error updating vehicle details");
      console.error("Error updating vehicle details:", error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.error("Failed:", errorInfo);
  };

  return (
    <div>
      <Breadcrumb routes={[{ breadcrumbName: "Dashboard/listVehicleRent" }]} />
      <div className="flex justify-end">
        <Button
          onClick={showDrawer}
          className="bg-green-500 text-white font-medium"
        >
          Thêm Mới
        </Button>
      </div>
      <Drawer title="Vehicle Details" onClose={onClose} open={open}>
        <Form
          form={form}
          name="vehicleDetails"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item label="Vehicle ID" name="id">
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Number Plate"
            name="licensePlate"
            rules={[
              { required: true, message: "Please input the license plate!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: "Please input a description!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Seats" name="numberSeat">
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
     
          </Form.Item>
        </Form>
      </Drawer>
      <div className="mt-5">
        <Table dataSource={dataSource} columns={columns} />
      </div>
    </div>
  );
};

export default ListVehicleRent;
