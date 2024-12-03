import {
  Breadcrumb,
  Button,
  Popconfirm,
  Table,
  Drawer,
  Form,
  Input,
  message,
  DatePicker,
} from "antd";
import axios from "axios";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { checkLoginToken } from "../../../utils";

const DriverList = () => {
  const [open, setOpen] = useState(false);
  const [idUser, setIdUser] = useState(null);
  const [dataUser, setDataUser] = useState([]);
  const [form] = Form.useForm();

  const handelFetchData = async () => {
    try {
      const { data } = await axios.get("https://boring-wiles.202-92-7-204.plesk.page/api/Driver", {
        headers: {
          Authorization: "Bearer " + checkLoginToken(),
        },
      });
      setDataUser(data);
    } catch (error) {
      console.error("Error fetching driver data:", error);
      message.error("Failed to fetch data");
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
      await axios.delete("https://boring-wiles.202-92-7-204.plesk.page/api/Driver/" + id, {
        headers: {
          Authorization: "Bearer " + checkLoginToken(),
        },
      });
      message.success("Driver removed successfully");
      handelFetchData();
    } catch (error) {
      console.error("Error deleting driver:", error);
      message.error("Failed to delete driver");
    }
  };

  const cancel = () => {
    message.error("Action cancelled");
  };

  const onFinish = async (values) => {
    try {
      await axios.put("https://boring-wiles.202-92-7-204.plesk.page/api/Driver/" + idUser, {
        ...values,
        dob: values.dob ? values.dob.toISOString() : null,
        status: true,
      });
      message.success("Driver details updated successfully");
      onClose();
      handelFetchData();
    } catch (error) {
      console.error("Error updating driver:", error);
      message.error("Failed to update driver");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.error("Failed:", errorInfo);
    message.error("Please check the form for errors");
  };

  useEffect(() => {
    const fetchDriverDetails = async () => {
      if (!idUser) return;
      try {
        const { data } = await axios.get(
          "https://boring-wiles.202-92-7-204.plesk.page/api/Driver/" + idUser,
          {
            headers: {
              Authorization: "Bearer " + checkLoginToken(),
            },
          }
        );
        form.setFieldsValue({
          ...data,
          dob: data.dob ? dayjs(data.dob) : null,
        });
      } catch (error) {
        console.error("Error fetching driver details:", error);
        message.error("Failed to fetch driver details");
      }
    };

    if (open) {
      fetchDriverDetails();
    }
  }, [open, idUser, form]);

  const dataSource = dataUser.filter((driver) => driver.status === true);

  const columns = [
    {
      title: "Driver Username",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Phone Number",
      dataIndex: "numberPhone",
      key: "numberPhone",
    },
    {
      title: "Action",
      render: ({ id }) => (
        <div className="space-x-5">
          <Popconfirm
            title="Delete the driver"
            description="Are you sure you want to delete this driver?"
            onConfirm={() => confirm(id)}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <Button className="bg-red-500 text-white font-semibold">Remove</Button>
          </Popconfirm>
          <Button
            onClick={() => {
              setIdUser(id);
              showDrawer();
            }}
            className="font-semibold"
          >
            Details
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Breadcrumb routes={[{ breadcrumbName: "Dashboard/Driver" }]} />
      <div className="flex justify-end mb-4">
        <Button
          onClick={showDrawer}
          className="bg-green-500 text-white font-medium"
        >
          Add New
        </Button>
      </div>
      <Drawer title="Driver Details" onClose={onClose} open={open}>
  <Form
    form={form}
    name="driverDetails"
    labelCol={{ span: 8 }}
    wrapperCol={{ span: 16 }}
    style={{ maxWidth: 600 }}
    autoComplete="off"
  >
    <Form.Item label="ID" name="id">
      <Input disabled />
    </Form.Item>
    <Form.Item
      label="Username"
      name="userName"
    >
      <Input disabled />
    </Form.Item>
    <Form.Item
      label="Name"
      name="name"
    >
      <Input disabled />
    </Form.Item>
    <Form.Item
      label="Phone Number"
      name="numberPhone"
    >
      <Input disabled />
    </Form.Item>
    <Form.Item label="Avatar" name="avatar">
      <Input disabled />
    </Form.Item>
    <Form.Item label="Date of Birth" name="dob">
      <DatePicker format="YYYY-MM-DD" disabled />
    </Form.Item>
    <Form.Item label="Status Work" name="statusWork">
      <Input disabled />
    </Form.Item>
    <Form.Item label="Type of Driver" name="typeOfDriver">
      <Input disabled />
    </Form.Item>
  </Form>
</Drawer>

      <Table dataSource={dataSource} columns={columns} />
    </div>
  );
};

export default DriverList;
