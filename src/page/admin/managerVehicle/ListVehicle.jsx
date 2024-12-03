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

const VehicleList = () => {
  const [open, setOpen] = useState(false);
  const [idUser, setIdUser] = useState(null);
  const [dataUser, setDataUser] = useState([]);
  const [form] = Form.useForm();

  // Fetch list of vehicles
  const handelFetchData = async () => {
    try {
      const { data } = await axios.get(
        "https://boring-wiles.202-92-7-204.plesk.page/api/Vehicle/listVehicle",
        {
          headers: {
            Authorization: "Bearer " + checkLoginToken(),
          },
        }
      );
      setDataUser(data);
    } catch (error) {
      console.error("Error fetching vehicle list:", error);
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
        `https://boring-wiles.202-92-7-204.plesk.page/api/Vehicle/deleteVehicleByStatus/${id}`,
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

  // Filter active vehicles
  const dataSource = dataUser.filter((data) => data.status === true);

  const columns = [
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "License Plate",
      dataIndex: "licensePlate",
      key: "licensePlate",
    },
    {
      title: "Number of Seats",
      dataIndex: "numberSeat",
      key: "numberSeat",
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

  // Fetch vehicle details for Drawer
  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        if (idUser) {
          const { data } = await axios.get(
            `https://boring-wiles.202-92-7-204.plesk.page/api/Vehicle/getInforVehicle/${idUser}`,
            {
              headers: {
                Authorization: "Bearer " + checkLoginToken(),
              },
            }
          );
          form.setFieldsValue({
            ...data,
            dob: data.dob ? dayjs(data.dob) : null,
            createdAt: data.createdAt ? dayjs(data.createdAt) : null,
            updateAt: data.updateAt ? dayjs(data.updateAt) : null,
          });
        }
      } catch (error) {
        console.error("Error fetching vehicle details:", error);
      }
    };

    if (open) {
      fetchVehicleDetails();
    }
  }, [open, idUser, form]);

  const onFinish = async (values) => {
    try {
      await axios.put(
        `https://boring-wiles.202-92-7-204.plesk.page/api/Vehicle/updateVehicle/${idUser}`,
        values,
        {
          headers: {
            Authorization: "Bearer " + checkLoginToken(),
          },
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
      <Breadcrumb routes={[{ breadcrumbName: "Dashboard/Vehicles" }]} />
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
            label="License Plate"
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
          <Form.Item
            label="Number of Seats"
            name="numberSeat"
            rules={[
              { required: true, message: "Please input the number of seats!" },
            ]}
          >
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

export default VehicleList;
